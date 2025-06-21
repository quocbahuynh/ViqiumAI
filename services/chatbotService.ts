import mongoose from "mongoose";
import { baseInformationCollection, baseInformationVectorStore, client } from "../mongovector.js";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages.js";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import crypto from "crypto";
import Order from "../models/Order.js";
import { transporter } from "../config/mail.js";
import model, { modelText } from "../config/generative.js";
import FacebookFanpage from "../models/FacebookFanpage.js";
import { formatToBaseMessages, getConversationId, getHistoryChat, sendMessage } from "../util/facebookApi.js";
import { sendPhoto } from "./facebookWebhookService.js";
import { redisClient } from "../config/redis.js";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { checkMessageLimitMiddleWare } from "../middleware/messagesLimit.js";


function generateOrderCode() {
    return 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

export const formatCurrency = (value: any): string => {
    return value.toLocaleString('vi-VN');
};

const getVietnameseDate = () => {
  const today = new Date(); // Get current date

  const day = today.getDate();         // Day (1–31)
  const month = today.getMonth() + 1;  // Month (0–11) → +1
  const year = today.getFullYear();    // Full year (YYYY)

  return `${day} tháng ${month} năm ${year}`;
};





type AllowAIType = {
    isAllowAI: boolean;
};

type ConfirmOrderType = {
    isConfirmed: boolean;
};

type product = {
    productInformation: String; // Ví dụ: "Áo thun Conan màu vàng size XL"
    price: String;              // Ví dụ: "300.000"
};

type OrderInfoType = {
    orderCode: String,
    phoneNumber: Number;
    address: String;
    products: product[];
    totalBeforePromotion: String;
    totalAftterPromotion: String;
};

type Message = {
    type: "text" | "url";
    content: string;
};

type MessagesType = {
    messages: Message[];
};

type IsSperateType = {
    shouldSperate: boolean;
};

const structureAIAnswer = async <T>(
    formatInstructions: string,
    instructionsPrompt: string,
    chat_history: BaseMessage[]
): Promise<T> => {
    const prompt = await ChatPromptTemplate.fromMessages([
        ["system", instructionsPrompt],
        ["system", "Lưu ý quan trọng: hãy luôn bao bọc đầu ra trong `JSON object`\n{format_instructions}"],
        new MessagesPlaceholder("chat_history"),
    ]).partial({
        format_instructions: formatInstructions,
    });

    const parser = new JsonOutputParser<T>();
    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ chat_history });
    return result;
};

const structureAIInput = async <T>(
    formatInstructions: string,
    instructionsPrompt: string,
    input: string,
): Promise<T> => {
    const prompt = await ChatPromptTemplate.fromMessages([
        ["system", instructionsPrompt],
        ["system", "Lưu ý quan trọng: hãy luôn bao bọc đầu ra trong `JSON object`\n{format_instructions}"],
        ["assistant", "{input}"]
    ]).partial({
        format_instructions: formatInstructions,
    });

    const parser = new JsonOutputParser<T>();
    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ input });
    return result;
};

const countWords = (text) => {
    return text.trim().split(/\s+/).length;
}

export const processQuestionByAI = async (chat_history: BaseMessage[], PROJECT_ID: any, CONVERSTATION_ID: string, EMAIL: string): Promise<Message[]> => {
    const InputStateAnnotation = Annotation.Root({
        chat_history: Annotation<BaseMessage[]>(),
        question: Annotation<string>(),
    });

    const StateAnnotation = Annotation.Root({
        messages: Annotation<Message[]>(),
        answer: Annotation<string>(),
        isAllowAI: Annotation<Boolean>(),
        isConfirmed: Annotation<Boolean>(),
        question: Annotation<string>(),
        chat_history: Annotation<BaseMessage[]>(),
        orderInfo: Annotation<OrderInfoType>(),
        orderCode: Annotation<String>(),
        shouldSperate: Annotation<Boolean>(),
    });

    const isAllowAI = async (state: typeof InputStateAnnotation.State) => {
        try {
            console.log("=====Check AI permission processing=====");

            const formatInstructions = `Chỉ phản hồi bằng một JSON object hợp lệ với định dạng sau:
{{ isAllowAI: boolean }}

Giải thích: 
- isAllowAI trả về "true" hoặc "false"
`;

            const instructionsPrompt = `
Bạn là trợ lý bán hàng thông minh, hãy xác định xem người dùng có đang yêu cầu trò chuyện với người thật hay không, dựa trên lịch sử hội thoại dưới đây.

### Hướng dẫn:
1. Chỉ khi khách hàng rõ ràng yêu cầu được nói chuyện với người thật (ví dụ: "Tôi muốn nói chuyện với nhân viên", "Cho tôi gặp người thật", "Không muốn dùng bot nữa") thì mới trả về "false".
2. Nếu khách hàng đồng ý hoặc cho phép bot tiếp tục hỗ trợ trả về "true".
3. Các trường hợp khác trả về "true".
4. Mặc định trả về "true".

### Bao bọc đầu ra trong JSON object như sau:
\n{format_instructions}
`;

            const result = await structureAIAnswer<AllowAIType>(formatInstructions, instructionsPrompt, state.chat_history);
            console.log(result)
            return { isAllowAI: result.isAllowAI ?? true };
        } catch (error) {
            console.error("ERROR: isAllowAI", error);
            return { isAllowAI: true };
        }
    };

    const isComfirmed = async (state: typeof InputStateAnnotation.State) => {
        try {
            console.log("=====Check Order confirmed=====");
            const formatInstructions = `Chỉ phản hồi bằng một JSON object hợp lệ với định dạng sau:
{{ isConfirmed: boolean }}`;

            const instructionsPrompt = `
Bạn là trợ lý bán hàng thông minh của cửa ha2nf:

### Nhiệm vụ: Dựa vào đoạn hội thoại dưới đây giữa bạn và khách hàng, hãy xác định **khách hàng có ĐÃ RÕ RÀNG CHỐT MỘT ĐƠN HÀNG MỚI** hay không, chỉ dựa vào cuộc hội thoại gần nhất.

### Hướng dẫn:
1. Trả về **true** nếu **khách hàng đã đồng ý chốt đơn hàng** sau khi bạn đã cung cấp đầy đủ thông tin chi tiết đơn hàng bao gồm:
   - Số điện thoại liên hệ
   - Địa chỉ giao hàng
   - Sản phẩm mua
   - Tổng tiền thanh toán

   Ví dụ các câu thể hiện khách hàng đã rõ ràng đồng ý chốt đơn:
   - "Ok"
   - "Chốt đơn"
   - "Mua luôn"
   - "Đồng ý đặt hàng"
   - "Giao cho bạn nhé"
   - "Xác nhận đơn hàng"
   - "Thanh toán cho mình"
   - Hoặc các câu tương tự thể hiện sự đồng ý hoàn tất đơn hàng mà ba5nn đã cung cấp sau khi đã nắm rõ thông tin.

2. Trả về **false** nếu:
   - Khách hàng chưa được cung cấp đầy đủ thông tin chi tiết đơn hàng mà đã nói "muốn mua" hay "quan tâm".
   - Khách hàng chỉ hỏi thông tin, hỏi giá, hoặc còn do dự.
   - Khách hàng xác nhận đơn đã đặt trước đó mà không đặt đơn mới.
   - Không chắc chắn hoặc câu trả lời mơ hồ.
   - Khách hàng chưa rõ ràng xác nhận chốt đơn sau khi có đầy đủ thông tin.

### Lưu ý:
- Chỉ đánh giá đoạn hội thoại mới nhất.
- Không nhầm lẫn với các đơn đã chốt hoặc hoàn tất trước đó.
- Kết quả phải là một JSON object hợp lệ có định dạng:


### Bao bọc đầu ra trong JSON object như sau:
\n{format_instructions}
`;


            const result = await structureAIAnswer<ConfirmOrderType>(formatInstructions, instructionsPrompt, state.chat_history);
            console.log("result confirm: " + JSON.stringify(result, null, 2))
            return { isConfirmed: result.isConfirmed }
        } catch (error) {
            console.error("ERROR: isConfirmed", error);
            return { isConfirmed: false };
        }
    }

    const extractInfoOrder = async (state: typeof StateAnnotation.State) => {
        console.log("=====Check Extract Infor Order=====");
        const formatInstructions = `Chỉ phản hồi bằng một đối tượng JSON hợp lệ theo định dạng sau:
    {{
      phoneNumber: "string",
      address: "string",
      products: [
        {{
          productInformation: "string", // Ví dụ: Áo phông Twentyfive x1 (Size L, Màu trắng)
          price: "string",
        }}
      ],
      totalBeforePromotion: "string",
      totalAftterPromotion: "string",
    }}
    `;


        const instructionsPrompt = `
    Bạn là trợ lý bán hàng thông minh, công việc của bạn là chốt đơn khách hàng.
    Khách hàng đã gửi thông tin giao hàng, hãy kiểm tra trong {chat_history}
### Nhiệm vụ:
    Bước 1: Trích xuất thông tin giao hàng, bao gồm:
      - Số điện thoại
      - Địa chỉ nhận hàng
    Bước 2: Trích xuất danh sách sản phẩm trong đơn hàng, mỗi sản phẩm bao gồm:
      - Thông tin sản phẩm (tên, số lượng màu, size, v.v.)
      - Giá tiền sản phẩm
    Bước 3: Tính toán và trích xuất:
      - Tổng tiền trước khi áp dụng khuyến mãi
      - Tổng tiền sau khi áp dụng khuyến mãi (nếu có)
    
### Lưu ý: Hãy tập trung vào câu hỏi mới nhất, không được nhầm lẫn với đơn hàng trong lịch sử.

### Giải thích:
    - phoneNumber: Số điện thoại khách hàng cung cấp.
    - address: Địa chỉ nhận hàng của khách.
    - products: Danh sách các sản phẩm trong đơn hàng
        + productInformation: Các thuộc tính của sản phẩm bao gồm: Tên, số lượng, size, màu....
        + price: Giá gốc của sản phẩm
    - totalBeforePromotion: Tổng tiền trước khi áp dụng khuyến mãi.
    - totalAftterPromotion: Tổng tiền sau khi áp dụng khuyến mãi.
    
### Bao bọc đầu ra trong JSON object như sau:
\`\`\`json\n{format_instructions}\n\`\`\`
            `

        const result = await structureAIAnswer<OrderInfoType>(formatInstructions, instructionsPrompt, state.chat_history);
        return { orderInfo: result }
    }

    const saveNewOrder = async (state: typeof StateAnnotation.State) => {
        try {
            console.log("=====Check Save Order=====");
            const formattedCarts = state.orderInfo.products
                .map(product => `- ${product.productInformation} + ${product.price}`)
                .join('\n');

            const newOrderCode = generateOrderCode();
            await Order.create({
                projectId: new mongoose.Types.ObjectId(PROJECT_ID),
                address: state.orderInfo.address,
                phoneNumber: state.orderInfo.phoneNumber,
                isRead: false,
                orderCode: newOrderCode,
                carts: formattedCarts,
                totalAftterPromotion: state.orderInfo.totalAftterPromotion,
                totalBeforePromotion: state.orderInfo.totalBeforePromotion,
                conversationId: CONVERSTATION_ID
            })

            return { orderCode: newOrderCode }
        } catch (error) {
            console.error(error)
        }
    }

    const sendOrderMail = async (state: typeof StateAnnotation.State) => {
        console.log("=====Check Send Mail=====");
        // Format product list
        const productList = state.orderInfo.products
            .map(p => `- ${p.productInformation} + ${p.price}`)
            .join('\n');

        // Email content
        const mailOptions = {
            from: '"Viqium" <hi.viqium@gmail.com>',
            to: `${EMAIL}`, // Replace with your recipient
            subject: `Bạn có một đơn hàng mới: #${state.orderCode}`,
            text: `
- Mã đơn hàng: #${state.orderCode}
- Số điện thoại: ${state.orderInfo.phoneNumber}
- Địa chỉ: ${state.orderInfo.address}

Danh sách sản phẩm:
${productList}

Tổng trước khuyến mãi: ${state.orderInfo.totalBeforePromotion}
Tổng sau khuyến mãi: ${state.orderInfo.totalAftterPromotion}
    `.trim()
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("✅ Order email sent!");
        } catch (error) {
            console.error("❌ Failed to send order email:", error);
        }
    };

    const answerWidthHistoryChat = async (state: typeof StateAnnotation.State) => {
        console.log("=====Check Answer=====");

        const filter = {
            preFilter: {
                projectId: { $eq: new mongoose.Types.ObjectId(PROJECT_ID) },
                category: { $ne: "knowledge" },
            },
        };


        const retrieverProduct = baseInformationVectorStore.asRetriever({
            searchType: "mmr", // or "similarity"
            filter: { preFilter: { projectId: new mongoose.Types.ObjectId(PROJECT_ID), category: "product" } },
            searchKwargs: {
                fetchK: 15,
                lambda: 1,
            },
        });

        const retrieverSale = baseInformationVectorStore.asRetriever({
            searchType: "mmr", // or "similarity"
            filter: { preFilter: { projectId: new mongoose.Types.ObjectId(PROJECT_ID), category: "sale" } },
            searchKwargs: {
                fetchK: 15,
                lambda: 1,
            },
        });

        const retrieveBaseInfo = baseInformationVectorStore.asRetriever({
            searchType: "mmr",
            filter: { preFilter: { projectId: new mongoose.Types.ObjectId(PROJECT_ID), category: "baseInfo" } },
            searchKwargs: {
                fetchK: 5,
                lambda: 1,
            },
        });

        const retriever = new EnsembleRetriever({
            retrievers: [retrieverProduct, retrieverSale, retrieveBaseInfo],
            weights: [0.5, 0.3, 0.2],
        });

        const advices = await baseInformationCollection.find({
            projectId: new mongoose.Types.ObjectId(PROJECT_ID),
            category: "knowledge"
        }, {
            projection: { content: 1, _id: 0 }
        }).toArray();

        let formatAdvices = "";
        if (advices.length >= 1) {
            formatAdvices = advices.map(item => `- ${item.content}`).join('\n');
        }


        const contextualizeQSystemPrompt = `
Dựa trên lịch sử trò chuyện và câu hỏi mới nhất từ người dùng để tham chiếu đến ngữ cảnh trong lịch sử trò chuyện,
hãy diễn đạt lại thành một câu hỏi độc lập có thể được hiểu mà không cần đến lịch sử trò chuyện.
Lưu ý: KHÔNG chỉ trả lời câu hỏi, chỉ diễn đạt lại nếu cần thiết, còn không thì giữ nguyên.
`;

        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", contextualizeQSystemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);

        const systemPrompt = `
Bạn là trợ lý bán hàng thông minh dành cho người bán hàng online nngành **THỜI TRANG**. Bạn đang trò chuyện với người dùng thông qua ứng dụng Facebook Messenger trên IOS. Điều này có nghĩa là hầu hết thời gian, câu trả lời của bạn nên chỉ dài khoảng một đến hai câu, trừ khi yêu cầu của người dùng cần lập luận hoặc nội dung dài. Không bao giờ sử dụng biểu tượng cảm xúc, trừ khi người dùng yêu cầu rõ ràng.

Chỉ sử dụng các tài liệu đã được truy xuất để trả lời câu hỏi sau. Không bổ sung thêm bất kỳ kiến thức bên ngoài nào.
Tài liệu được truy xuất: 
<context>\n{context}\n</context>
Dựa vào thông tin trong tài liệu, hãy phân tích vấn đề hoặc tình huống được nêu, chia thành các bước logic rõ ràng và xử lý từng bước một, chỉ sử dụng nội dung từ tài liệu đã truy xuất.

Ngoài ra, bạn hãy bổ sung kiến thức của dựa vào những tài liệu huấn luyện:
${formatAdvices}
Dựa vào thông tin trong tài liệu huấn huyện, bạn hãy coi như các quy tắc, lời khuyên, kiến thức hoặc các thông tin cần cập nhật lại để tư vấn khách hàng tốt hơn.

Trong suốt cuộc trò chuyện, bạn sẽ thích nghi với giọng điệu và sở thích của người dùng. Cố gắng bắt nhịp với phong cách, ngữ điệu và cách trò chuyện của họ. Mục tiêu là khiến cuộc trò chuyện trở nên tự nhiên. Bạn tham gia vào cuộc trò chuyện một cách chân thật bằng cách phản hồi theo tài liệu đã được truy xuất, đặt câu hỏi phù hợp và thể hiện sự tò mò chân thành. Nếu phù hợp, hãy tiếp tục cuộc trò chuyện theo cách thân mật, thoải mái.

Nhiệm vụ của bạn là tư vấn sản phẩm và khuyến mãi đang có. Ngoài ra hãy hỗ trợ, chăm sóc khách hàng, giúp khách chọn đúng sản phẩm họ cần. Trong suốt cuộc trò chuyện hãy tinh tế đề xuất chương trình khuyến mãi có liên quan đến sản phẩm mà khách hàng đang có nhu cầu, mục tiêu nhằm gia tăng giá trị đơn hàng.

Trong quá trình trò chuyện và tư vấn với khách hàng, Nếu khách hàng hỏi mua hàng, hãy gửi cho khách hàng sản phẩm phù hợp bằng cách cung cấp **Tên sản phẩm**, **Link ảnh**, **Giá tiền**, **Thông tin khuyến mãi** (nếu có). Mục tiêu là là khiến cuộc trò chuyện ngắn gọn, giúp khách hàng dễ dàng nắm bắt thông tin. **Bạn không nên** gửi lại ảnh nếu đã gửi ảnh sản phẩm đó trước đó.

Trong quá trình tư vấn sản phẩm hay quan tâm đến **phân loại sản phẩm**, vì mỗi loại sản phẩm sẽ có **phân loại sản phẩm** khác nhau.

Trong quá trình trò chuyện và tư vấn với khách hàng, **bạn nên** tìm kiếm chương trình khuyến mãi cho sản phẩm, Trong trường hợp không có khuyến mãi, thì không cần đề cập đến. **Bạn không nên** nhầm lẫn với khuyến mãi trong lịch sử trò chuyện.

Khi bạn **chốt đơn** khách hàng, bạn nên tóm tắt thông tin **đơn hàng* cho khách hàng. Trong trường hợp sản phẩm có khuyến mãi, hãy chia thành hai khoản tổng tiền **tổng tiền trước khi khuyến mãi** và **tổng tiền sau khi khuyến mãi**

Khi bạn **chốt đơn** khách hàng, hãy yêu cầu khách hàng cung cấp *số điện thoại** và **địa chỉ giao hàng**. Trong trường hợp khách hàng đã **chốt đơn** trong lịch sử trò chuyện, hãy xác nhận lại thông tin giao hàng với khách hàng.

Hãy nhớ, dựa trên thông tin sản phẩm và khuyến mãi để cung cấp thông tin **đơn hàng** cho khách hàng, vì có thể mỗi sản phẩm sẽ có **phân loại sản phẩm** khác nhau.

Hãy nhớ bạn là nhà bán hàng thông minh. Điều này nghĩa là bạn phải luôn kiểm tra **đơn hàng** thật kỹ trước khi  **chốt đơn** khách hàng. Mục tiêu là tránh gây sai sót trong quản lý tiền bạc.

Nếu bạn còn băn khoăn, hoặc không biết điều gì, hãy hỏi lại khách hàng để xác nhận. 
`;


        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);

        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm: modelText,
            retriever: retriever,
            rephrasePrompt: contextualizeQPrompt,
        });


        const questionAnswerChain = await createStuffDocumentsChain({
            llm: modelText,
            prompt: qaPrompt,
        });

        const ragChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain: questionAnswerChain,
        });

        const response = await ragChain.invoke({
            chat_history: state.chat_history,
            input: "",
        });
        return { answer: response.answer };

    }

    const shouldSperate = async (state: typeof StateAnnotation.State) => {
        try {
            console.log("=====Check AI sperate=====");

            const formatInstructions = `Chỉ phản hồi bằng một JSON object hợp lệ với định dạng sau:
{{ shouldSperate: boolean }}

Giải thích: 
- shouldSperate trả về "true" hoặc "false"
`;

            const instructionsPrompt = `
Bạn là ChatGPT. Nhiệm vụ của bạn là xác định xem tin nhắn đó **có nên được xử lý riêng biệt (shouldSperate = true)** hay không, dựa trên các tiêu chí sau:

Trả về **"true"** nếu thỏa mãn *bất kỳ một* trong các điều kiện sau:
1. Tin nhắn có độ dài vượt quá 130 từ tiếng Việt.
2. Tin nhắn chứa liên kết (URL).
3. Nội dung liên quan đến tư vấn hình ảnh. 
4. Nội dung xác nhận đơn hàng (ví dụ: "xác nhận giúp đơn này", v.v.).
5. Nội dung đang trình bày danh sách nhiều hơn 2 sản phẩm hoặc đề cập đến khuyến mãi.

Ngược lại, mặc định trả về **"false"**.

### Bao bọc đầu ra trong JSON object như sau:
\n{format_instructions}
`;

            const result = await structureAIInput<IsSperateType>(formatInstructions, instructionsPrompt, state.answer);
            console.log(result)

            return { shouldSperate: result.shouldSperate ?? true };
        } catch (error) {
            console.error("ERROR: shouldSperate", error);
            return { shouldSperate: true };
        }
    };

    const sperateChat = async (state: typeof StateAnnotation.State) => {
        try {
            console.log("=====Check AI sperate message=====");

            const formatInstructions = `Chỉ phản hồi bằng một JSON object hợp lệ với định dạng sau:
{{ messages: [{{type: "text" | "url", content: "string"}}]}}

Giải thích: 
- Mỗi phần tử trong "messages" là một đối tượng có hai thuộc tính: "type" và "content".
- "type" có thể là:
  - "text" nếu "content" là nội dung văn bản thông thường.
  - "url" nếu "content" là một đường dẫn (bắt đầu bằng "http://" hoặc "https://").
- Luôn đảm bảo xác định đúng loại dữ liệu để phân loại chính xác.
- Nếu có đường dẫn (URL), hãy tách riêng ra thành một phần tử độc lập trong mảng, không gộp vào cùng văn bản.
- Không thêm văn bản ngoài JSON object được yêu cầu. `;

            const instructionsPrompt = `
Bạn là ChatGPT Nhiệm vụ của bạn là chia nhỏ tin nhắn của bạn sao cho:
1. **Giữ nguyên nội dung** của văn bản gốc.
2. **Chia nhỏ nội dung phản hồi** thành các tin nhắn hợp lý. Mỗi tin nhắn nên là một câu hoặc đoạn văn nhỏ.
3. Tránh cắt ngang câu hoặc cắt giữa các ý đang diễn đạt.
4. Nếu trong nội dung có chứa **URL** (đường dẫn bắt đầu bằng \`http://\` hoặc \`https://\`):
   - Hãy tách URL đó thành **một phần tử riêng** trong mảng \`messages\`,
   - Phần tử đó có \`type\` là \`"url"\`,
   - **Không để URL nằm trong văn bản chính**.
5. **Thông tin sản phẩm** phải được **gộp chung vào một phần duy nhất**, không chia nhỏ từng dòng.

### Bao bọc đầu ra trong JSON object như sau:
\n{format_instructions}
`;

            const result = await structureAIInput<MessagesType>(formatInstructions, instructionsPrompt, state.answer);
            console.log(result)
            return { messages: result.messages };
        } catch (error) {
            console.error("ERROR: sperateChat", error);
            return {
                messages: [
                    { type: "text", content: state.answer }
                ]
            };
        }
    }

    const noSpearateChat = async (state: typeof StateAnnotation.State) => {
        return {
            messages: [
                { type: "text", content: state.answer }
            ]
        };
    }

    function routeAllowAI(state: typeof StateAnnotation.State): string[] {
        if (state.isAllowAI == true) {
            return ["checkConfirmedOrder"];
        }
        return ["__end__"];
    }


    function routeConfirmedOrder(state: typeof StateAnnotation.State): string[] {

        console.log(state.isConfirmed)
        if (state.isConfirmed == true) {
            return ["extractDataOrder"];
        }
        return ["answerWithHistoryChat"];
    }


    function routeCountWords(state: typeof StateAnnotation.State): string[] {
        if (state.shouldSperate) {
            return ["makeSperateChat"];
        }
        return ["avoidSperateChat"];
    }



    const workflow = new StateGraph(StateAnnotation)
        .addNode("checkAllowAI", isAllowAI)
        .addNode("checkConfirmedOrder", isComfirmed)
        .addNode("extractDataOrder", extractInfoOrder)
        .addNode("saveOrder", saveNewOrder)
        .addNode("sendEmail", sendOrderMail)
        .addNode("answerWithHistoryChat", answerWidthHistoryChat)
        .addNode("isSperate", shouldSperate)
        .addNode("makeSperateChat", sperateChat)
        .addNode("avoidSperateChat", noSpearateChat)
        .addEdge("__start__", "checkAllowAI")
        .addConditionalEdges("checkAllowAI", routeAllowAI, ["checkConfirmedOrder", "__end__"])
        .addConditionalEdges("checkConfirmedOrder", routeConfirmedOrder, ["extractDataOrder", "answerWithHistoryChat"])
        .addEdge("extractDataOrder", "saveOrder")
        .addEdge("saveOrder", "sendEmail")
        .addEdge("sendEmail", "answerWithHistoryChat")
        .addEdge("answerWithHistoryChat", "isSperate")
        .addConditionalEdges("isSperate", routeCountWords, ["makeSperateChat", "avoidSperateChat"])
        .addEdge("makeSperateChat", "__end__")
        .addEdge("avoidSperateChat", "__end__")
        .compile();

    const result = await workflow.invoke({
        chat_history,
        question: ""
    })
    return result.messages;

};



export async function processMessageQueue(senderId, recipientId, fanpage) {
    try {
        console.log("Run process")
        // Step 1: Collect messages from Redis
        let messages = [];
        while (true) {
            const msg: any = await redisClient.lPop(`queue:${senderId}`);
            if (msg === null || msg === undefined) {
                break;
            }

            try {
                messages.push(msg);
            } catch (err) {
                console.error("Failed to parse Redis message:", msg);
            }
        }

        console.log(messages)

        if (messages.length < 1) {
            await redisClient.del(`processing:${senderId}`);
            return;
        }


        // Step 2: Find Facebook fanpage from recipientId
        if (!fanpage) {
            const fanpageActive = await FacebookFanpage.findOne({
                pageId: recipientId,
                active: true
            })
                .populate("userId")
                .populate("projectId");

            const project: any = fanpageActive.projectId;
            if (project.facebookFanpageId.toString() == fanpageActive._id.toString()) {
                fanpage = fanpageActive;
            }

        }


        const FANPAGE_COLLECTION_ID = fanpage._id
        const FANPAGE_ID = fanpage.pageId;
        const FANPGE_ACESSTOKEN = fanpage.accessToken;
        const PROJECT_ID = fanpage.projectId._id;
        const EMAIL = fanpage.userId.email;
        const USER_ID = fanpage.userId._id;

        const reachLimit = await checkMessageLimitMiddleWare(USER_ID);

        if (!reachLimit.allowed) {
            await redisClient.del(`processing:${senderId}`);
            throw new Error(`User ${USER_ID} has reached their daily message limit.`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        let CONVERSTATION_ID = await getConversationId(FANPAGE_ID, senderId, FANPGE_ACESSTOKEN);
        // Step 3: Get converstaion id 
        const originalHistory = await getHistoryChat(CONVERSTATION_ID, FANPGE_ACESSTOKEN, 12);
        // Step 4: Convert history to BaseMessage type of Langchain JS
        let history: any[] = await formatToBaseMessages(originalHistory, FANPAGE_ID, senderId, PROJECT_ID);

        // Step 6: Store converstation in Redis
        const converstaionRedis: any = await redisClient.hGet(`conver:${FANPAGE_ID}`, `${CONVERSTATION_ID}`);

        if (!converstaionRedis) {
            const newConver = {
                id: CONVERSTATION_ID,
                fanpageId: FANPAGE_COLLECTION_ID,
                fanpageFBId: FANPAGE_ID,
                fanpageAcessToken: FANPGE_ACESSTOKEN,
                projectId: PROJECT_ID,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }
            await redisClient.hSet(`conver:${FANPAGE_ID}`, `${CONVERSTATION_ID}`, JSON.stringify(newConver));
        }

        if (converstaionRedis) {
            const parsedConver = JSON.parse(converstaionRedis);

            parsedConver.projectId = PROJECT_ID;
            parsedConver.fanpageAcessToken = FANPGE_ACESSTOKEN;
            parsedConver.updatedAt = Date.now();
            await redisClient.hSet(`conver:${FANPAGE_ID}`, `${CONVERSTATION_ID}`, JSON.stringify(parsedConver));
        }

        // Step 7: AI process
        const answers = await processQuestionByAI(history, PROJECT_ID, CONVERSTATION_ID, EMAIL);

        const remaining: any = await redisClient.lLen(`queue:${senderId}`);
        console.log("Remaining items in queue:", remaining);



        if (remaining < 1) {
            await redisClient.del(`processing:${senderId}`);
            for (const answer of answers) {
                if (answer.type == "text") {
                    await sendMessage(senderId, answer.content, FANPGE_ACESSTOKEN)
                } else {
                    await sendPhoto(senderId, FANPGE_ACESSTOKEN, answer.content)
                }
                new Promise(resolve => setTimeout(resolve, 900));
            }
        } else {
            await processMessageQueue(senderId, recipientId, fanpage);
        }
    } catch (error) {
        console.error('Error processing message queue:', error);
        await redisClient.del(`processing:${senderId}`);
        throw error;
    }
}
