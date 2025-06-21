import model, { modelText } from "../config/generative.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { baseInformationVectorStore } from "../mongovector.js";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { embedKnowledge } from "../ai/embed.js";
import { Document } from "langchain/document";
import mongoose from "mongoose";
import { checkMessageLimitMiddleWare } from "../middleware/messagesLimit.js";
import { redisClient } from "../config/redis.js";

type IsAdvice = {
    return: boolean;
};

type IsDuplicateAdvice = {
    duplicatedAdvices: string[],
    formatAdvice: string,
};

export const generateChatbotAnswer = async (userId: string, projectId: string, question: string) => {
    // 1. Save user question
    const userQuetion = { role: "user", content: question };
    await redisClient.rPush(`trainingChat:${projectId}`, JSON.stringify(userQuetion));

    const chatKey = `trainingChat:${projectId}`;
    const messagesRaw: any = await redisClient.lRange(chatKey, 0, -1);
    const chatHistory = messagesRaw.map((item: string) => JSON.parse(item));

    // 2. Setup LangGraph States
    const StateAnnotation = Annotation.Root({
        question: Annotation<string>(),
        isAdvice: Annotation<boolean>(),
        duplicatedAdvices: Annotation<string[]>(),
        advices: Annotation<Document[]>(),
        formatAdvice: Annotation<string>(),
        context: Annotation<string>(),
        answer: Annotation<string>(),
    });

    const InputStateAnnotation = Annotation.Root({
        question: Annotation<string>(),
    });

    // 3. Define Tools
    const isAdviceTool = async (state: typeof InputStateAnnotation.State) => {
        const formatInstructions = `
        Chỉ phản hồi bằng một đối tượng JSON hợp lệ với định dạng sau:
        {{ "return": "boolean" }}
        - Trả về \`true\` nếu câu nói là một lời khuyên, yêu cầu cập nhật kiến thức mới, hoặc yêu cầu cập nhật thông tin.
        - Trả về \`false\` nếu câu nói không thuộc các dạng trên.
      `;

        const parser = new JsonOutputParser<IsAdvice>();

        const systemPrompt = `
Bạn là một trợ lý bán hàng thông minh. Nhiệm vụ của bạn là xác định xem câu đầu vào từ người dùng có thuộc một trong các dạng sau không: lời khuyên, yêu cầu cập nhật kiến thức mới, hoặc yêu cầu cập nhật thông tin.

**Hướng dẫn**:
1. **Xác định tính hợp lệ của đầu vào '{query}'**:
   - **Lời khuyên**: Gợi ý, hướng dẫn, hoặc đề xuất để cải thiện hoạt động, thường mang tính chỉ dẫn (ví dụ: "Giảm giá sản phẩm để tăng doanh số", "Tập trung vào khách hàng VIP").
   - **Cập nhật thông tin mới**: Yêu cầu cập nhật thông tin sửa đổi hoặc bổ sung cho dữ liệu, không phải câu hỏi.
   - **Yêu cầu cập nhật kiến thức mới**: Yêu cầu cập nhật kiến thức mới ngẫu nhiên, không phải câu hỏi.
2. **Trả về kết quả** dưới dạng JSON hợp lệ theo định dạng:
   \`\`\`json
   {format_instructions}
   \`\`\`

**Câu đầu vào**:
{query}
`;
        const prompt = await ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["user", "{query}"],
        ]).partial({
            format_instructions: formatInstructions,
        });

        const chain = prompt.pipe(model).pipe(parser);
        const result = await chain.invoke({ query: state.question });
        return { isAdvice: result.return, advices: [] };
    };

    const retrieverAdvices = async (state: typeof InputStateAnnotation.State) => {
        const filter = {
            preFilter: {
                projectId: { $eq: new mongoose.Types.ObjectId(projectId) },
                category: { $eq: "knowledge" },
            },
        };
        const retrievedDocs = await baseInformationVectorStore.similaritySearch(state.question, 6, filter);
        return { advices: retrievedDocs };
    };

    const isDuplicateTool = async (state: typeof StateAnnotation.State) => {
        const formatInstructions = `
Chỉ phản hồi bằng một đối tượng JSON hợp lệ với định dạng sau:
{{
  "duplicatedAdvices": ["string"],
  "formatAdvice": "string"
}}
- "duplicatedAdvices": Mảng các lời khuyên trong dữ liệu kiến thức có ý nghĩa tương tự hoặc trùng với lời khuyên mới. Nếu không có lời khuyên nào trùng, trả về [].
- "formatAdvice": Một câu ngắn gọn (dưới 35 từ), dễ nhớ, tóm tắt hoặc trích xuất ý chính của lời khuyên mới. Câu này phải rõ ràng, súc tích và giữ được ý nghĩa cốt lõi.
- Đảm bảo JSON hợp lệ, không chứa ký tự thừa hoặc lỗi cú pháp.
`;

        const promptCheckDuplicateAdviceTemplate = `
Kiểm tra xem lời khuyên mới này '{advice}' dành cho bạn đã có trong cơ sở dữ liệu kiến thức của bạn hay chưa? .Bao bọc đầu ra trong thẻ json\n{format_instructions}

Dữ liệu kiến thức: 
{knowledges}
`

        const parser = new JsonOutputParser<IsDuplicateAdvice>();
        const prompt = await ChatPromptTemplate.fromMessages([
            ["system", promptCheckDuplicateAdviceTemplate],
            ["user", "{advice}"],
        ]).partial({
            format_instructions: formatInstructions,
        });

        const docsContent = state.advices.map((doc) => doc.pageContent).join("\n");
        const chain = prompt.pipe(model).pipe(parser);
        const result = await chain.invoke({ advice: state.question, knowledges: docsContent });
        return { duplicatedAdvices: result.duplicatedAdvices, formatAdvice: result.formatAdvice };
    };

    const embedKnowledgeTool = async (state: typeof StateAnnotation.State) => {
        await embedKnowledge(state.formatAdvice, projectId);
    };

    const routeIsAdviceProcess = async (state: typeof StateAnnotation.State) => {
        const limited = await checkMessageLimitMiddleWare(userId);
        if (state.isAdvice === true && limited.allowed === true) {
            return "retrieverAdvices";
        }
        if (!limited.allowed) {
            return "limit"
        }
        return "model";
    }

    function routeIsDuplicateProcess(state: typeof StateAnnotation.State): string {
        if (state.duplicatedAdvices.length >= 1) return "model";
        return "embedKnowledge";
    }

    async function callModel(state: typeof StateAnnotation.State) {
        const contextualizeQSystemPrompt =
            "Dựa trên lịch sử trò chuyện và câu hỏi hoặc lời khuyên mới nhất từ người dùng, " +
            "hãy ưu tiên tập trung vào câu hỏi hoặc lời khuyên mới để tạo ra một phiên bản độc lập, rõ ràng.\n\n" +
            "Nếu câu hỏi hoặc lời khuyên mới đã đủ rõ, hãy giữ nguyên.\n" +
            "Chỉ tham khảo lịch sử nếu cần làm rõ nội dung câu hỏi hoặc lời khuyên .\n" +
            "Không được trả lời câu hỏi, chỉ diễn đạt lại nếu thực sự cần thiết.\n\n" +
            "Mục tiêu: Tạo câu trả lời hoàn chỉnh nhất có thể, nhưng dựa chủ yếu vào nội dung câu hỏi hoặc lời khuyên hiện tại.";

        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", contextualizeQSystemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);

        const filterData = {
            preFilter: { projectId: { $eq: new mongoose.Types.ObjectId(projectId) } },
            category: { $ne: 'knowledge' }
        };

        const retriever = baseInformationVectorStore.asRetriever({
            searchType: "mmr",
            filter: filterData,
            searchKwargs: { fetchK: 9, lambda: 0.1 },
        });

        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm: modelText,
            retriever,
            rephrasePrompt: contextualizeQPrompt,
        });

        const systemPrompt = `
Bạn là quản lý bán hàng của người dùng.

Nhiệm vụ:
1. Nhận lời khuyên, cập nhật thông tin mới và yêu cầu cập nhât kiến thức mới từ người dùng để làm giàu kiến thức hệ thống.
2. Trả lời các câu hỏi vềs mặt hàng, sản phẩm, dịch vụ và chương trình khuyến mãi, dựa trên dữ liệu nội bộ trong {context}.
3. Sử dụng thông tin công ty/thương hiệu/cửa hàng/doanh nghiệp (như tên công ty, khu vực hoạt động, chính sách bán hàng, thông điệp thương hiệu...) để đưa ra câu trả lời phù hợp với thực tế kinh doanh của người dùng.
4. Nếu lời khuyên mới có ý nghĩa tương tự hoặc gần giống (dựa trên ý chính, không cần giống từ ngữ chính xác) với các lời khuyên trước đó {duplicatedAdvices}, hãy thực hiện theo hướng dẫn dưới đây
    - Liệt kê các lời khuyên trùng lặp.
    - Hãy hiển thị cả lời khuyên mới và các lời khuyên cũ để người dùng lựa chọn hoặc chỉnh sửa.
5. Khi trả lời người dùng, luôn thể hiện sự chuyên nghiệp, dễ hiểu và có định hướng hành động.
6. Nếu không đủ thông tin để tư vấn, hãy đề xuất người dùng bổ sung thêm thông tin.
7. Hãy tỏ thái độ biết ơn khi người dùng đưa cho bạn một lời khuyên hoặc một kiến thức mới.
8. Trả lời ngắn gọn, nếu dài quá thì trả lời dưới 300 từ.

Ghi nhớ: 
- Bạn không phải là người bán hàng trực tiếp, mà là quản lý hỗ trợ người dùng trong việc bán hàng hiệu quả hơn, dựa trên kiến thức và thông tin đã được cung cấp.
- Chỉ sử dụng dữ liệu của nội bộ, không được phép sửa dụng dữ liệu từ bên ngoài.
`;

        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({
            llm: modelText,
            prompt: qaPrompt,
        });

        const ragChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain: questionAnswerChain,
        });

        const response = await ragChain.invoke({
            input: "",
            chat_history: chatHistory,
            duplicatedAdvices: state.duplicatedAdvices
        });

        return { answer: response.answer };
    }

    function reachLimit() {
        return { answer: "Vượt quá giới hạn gói!" }
    }

    // 4. Compile and Run Graph
    const graph = new StateGraph(StateAnnotation)
        .addNode("model", callModel)
        .addNode("limit", reachLimit)
        .addNode("isadvice", isAdviceTool)
        .addNode("embedKnowledge", embedKnowledgeTool)
        .addNode("retrieverAdvices", retrieverAdvices)
        .addNode("isDuplicatAdvice", isDuplicateTool)
        .addEdge("__start__", "isadvice")
        .addConditionalEdges("isadvice", routeIsAdviceProcess, ["retrieverAdvices", "limit", "model"])
        .addEdge("retrieverAdvices", "isDuplicatAdvice")
        .addConditionalEdges("isDuplicatAdvice", routeIsDuplicateProcess, ["model", "embedKnowledge"])
        .addEdge("embedKnowledge", "model")
        .addEdge("limit", "__end__")
        .addEdge("model", "__end__")
        .compile();

    const result = await graph.invoke({ question });

    // Set new option
    let newOption = null
    if (result.advices?.length >= 1) {
        newOption = new Document({
            pageContent: result.formatAdvice,
            metadata: {
                _id: new mongoose.Types.ObjectId(),
                projectId: new mongoose.Types.ObjectId(projectId),
                category: "knowledge"
            }
        });
    }

    const assistantAnswer = {
        role: "assistant",
        content: result.answer
    }
    await redisClient.rPush(`trainingChat:${projectId}`, JSON.stringify(assistantAnswer));

    return {
        from: "assistant",
        content: result.answer,
        newOption,
        optionsDuplicate: result.advices,
    };
};
