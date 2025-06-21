import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { Document } from "@langchain/core/documents";
import mongoose from "mongoose";
import { baseInformationCollection, baseInformationVectorStore } from "../mongovector.js";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { v4 as uuidv4 } from "uuid";
import Product from "../models/Product.js";
import { formatDateToDDMMYYYY, transPromotionTypeValue } from "../models/ProductPromotion.js";
import { getVectorEmbedPhoto } from "./embedImage.js";
import ImageEmbed from "../models/ImageEmbed.js";

export const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN');
};

export const deleteVectors = async (ids) => {
    await baseInformationVectorStore.delete({ ids });
}

export const embedProductDiscount = async (promotion) => {
    let discountList = [];
    let ids = []
    for (const p of promotion.productApply) {
        const product = await Product.findById(p.productId);
        if (product) {
            let productPromotion = ``;
            productPromotion += `Chương trình khuyến mãi cho sản phẩm ${product.name}: \n`;
            productPromotion += `- Khuyến mãi: ${transPromotionTypeValue(p.promoteType, p.promotePricing)} \n`;
            productPromotion += `- Tên chương trình khuyến mãi: ${promotion.name} \n`
            productPromotion += `- Áp dụng cho tất cả các lựa chọn/phân loại của sản phẩm\n`;
            productPromotion += `- Thời gian áp dụng: ${formatDateToDDMMYYYY(promotion.startTime)} - ${formatDateToDDMMYYYY(promotion.endTime)} \n`;

            const productPromotionDoc = new Document({
                pageContent: productPromotion,
                metadata: {
                    category: "sale",
                    projectId: promotion.projectId,
                    promoteId: promotion._id
                },
            });
            discountList.push(productPromotionDoc)
            ids.push(uuidv4())
        }

    }
    await baseInformationVectorStore.addDocuments(discountList, { ids })

    return ids;
}

export const embedProductCombo = async (promotion) => {
    let ids = [uuidv4()];
    let productPromotion = `Chương trình khuyến mãi COMBO:\n`;
    productPromotion += `- Tên combo: ${promotion.name} \n`;
    productPromotion += `- Sản phẩm áp dụng:\n`

    for (const p of promotion.productApply) {
        const product = await Product.findById(p.productId);
        if (product) {
            productPromotion += ` + ${product.name}\n`
        }

    }
    productPromotion += `- Ưu đãi: ${transPromotionTypeValue(promotion.productApply[0].promoteType, promotion.productApply[0].promotePricing)} tổng giá trị combo \n`
    productPromotion += `- Áp dụng cho tất cả các lựa chọn/phân loại của sản phẩm\n`;
    productPromotion += `- Thời gian áp dụng: ${formatDateToDDMMYYYY(promotion.startTime)} - ${formatDateToDDMMYYYY(promotion.endTime)} \n`;

    const productPromotionDoc = new Document({
        pageContent: productPromotion,
        metadata: {
            category: "sale",
            projectId: promotion.projectId,
            promoteId: promotion._id
        },
    });
    await baseInformationVectorStore.addDocuments([productPromotionDoc], { ids })
    return ids;
}

export const embedProductBluk = async (promotion) => {
    let discountList = [];
    let ids = []
    for (const p of promotion.productApply) {
        const product = await Product.findById(p.productId);
        if (product) {
            let productPromotion = ``;
            productPromotion += `Chương trình khuyến mãi GIẢM GIÁ THEO SỐ LƯỢNG: \n`;
            productPromotion += `- Sản phẩm áp dụng: ${product.name}\n`
            productPromotion += `- Khuyến mãi: ${transPromotionTypeValue(p.promoteType, p.promotePricing)}\n`;
            productPromotion += `- Điều khiện áp dụng: Mua từ ${p.promoteTarget} sản phẩm trở lên \n`
            productPromotion += `- Tên chương trình khuyến mãi: ${promotion.name} \n`
            productPromotion += `- Áp dụng cho tất cả các lựa chọn/phân loại của sản phẩm\n`;
            productPromotion += `- Thời gian áp dụng: ${formatDateToDDMMYYYY(promotion.startTime)} - ${formatDateToDDMMYYYY(promotion.endTime)} \n`;

            const productPromotionDoc = new Document({
                pageContent: productPromotion,
                metadata: {
                    category: "sale",
                    projectId: promotion.projectId,
                    promoteId: promotion._id
                },
            });
            discountList.push(productPromotionDoc)
            ids.push(uuidv4())
        }

    }
    await baseInformationVectorStore.addDocuments(discountList, { ids })

    return ids;
}

export const embedProductGift = async (promotion) => {
    let discountList = [];
    let ids = [];
    let productGifts = [];
    for (const p of promotion.productApply) {
        const product = await Product.findById(p.productId);
        if (product) {
            let productPromotion = ``;
            productPromotion += `Chương trình khuyến mãi TẶNG QUÀ:\n`;
            productPromotion += `- Sản phẩm áp dụng: ${product.name}\n`
            productPromotion += `- Quà tặng: `;

            if (productGifts.length < 1) {
                for (const giftId of p.productGift || []) {
                    const gift = await Product.findById(giftId);

                    if (gift) {
                        productGifts.push(`1 ${gift.name}`)
                    }
                }
            }
            productPromotion += productGifts.join(" + ");
            productPromotion += `\n`;
            productPromotion += `- Điều khiện áp dụng: Mua từ ${p.promoteTarget} sản phẩm trở lên \n`
            productPromotion += `- Tên chương trình khuyến mãi: ${promotion.name} \n`
            productPromotion += `- Áp dụng cho tất cả các lựa chọn/phân loại của sản phẩm\n`;
            productPromotion += `- Thời gian áp dụng: ${formatDateToDDMMYYYY(promotion.startTime)} - ${formatDateToDDMMYYYY(promotion.endTime)} \n`;

            const productPromotionDoc = new Document({
                pageContent: productPromotion,
                metadata: {
                    category: "sale",
                    projectId: promotion.projectId,
                    promoteId: promotion._id
                },
            });
            discountList.push(productPromotionDoc)
            ids.push(uuidv4())
        }

    }
    await baseInformationVectorStore.addDocuments(discountList, { ids })

    return ids;
}

export async function embedPromote(originalInformation, promoteId, projectId) {
    try {
        const doc = new Document({
            pageContent: originalInformation,
            metadata: {
                category: "sale",
                projectId: projectId,
                promoteId: promoteId,
            },
        });

        // Count only matching documents
        const count = await baseInformationCollection.countDocuments({
            category: "sale",
            projectId: projectId,
            promoteId: promoteId,
        });

        if (count >= 1) {
            await baseInformationCollection.deleteMany({
                category: "sale",
                projectId: projectId,
                promoteId: promoteId,
            });
        }

        await baseInformationVectorStore.addDocuments([doc]);
    } catch (error) {
        console.error(error);
    }
}

export async function embedProduct(originalInformation, productId, projectId) {
    try {
        const doc = new Document({
            pageContent: originalInformation,
            metadata: {
                category: "product",
                projectId: projectId,
                productId: productId,
            },
        });

        // Count only matching documents
        const count = await baseInformationCollection.countDocuments({
            category: "product",
            projectId: projectId,
            productId: productId,
        });

        if (count >= 1) {
            await baseInformationCollection.deleteMany({
                category: "product",
                projectId: projectId,
                productId: productId
            });
        }

        await baseInformationVectorStore.addDocuments([doc]);
    } catch (error) {
        console.error(error);
    }
}

export async function embedInformation(originalInformation, projectId, category) {
    // Step 1: Create a splitter
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,        // smaller chunks (you can adjust)
        chunkOverlap: 50,      // overlap for better context
    });

    // Step 2: Wrap the raw HTML in a Document object
    const doc = new Document({ pageContent: originalInformation });

    // Step 3: Convert HTML to plain text
    const transformer = new HtmlToTextTransformer();
    const textDocs = await transformer.invoke([doc]);

    // Step 4: Split plain text into chunks
    const documents = await splitter.splitDocuments(textDocs);

    const documentsWithMetadata = documents.map(doc => ({
        pageContent: doc.pageContent,
        metadata: {
            projectId,
            category
        },
    }));

    const count = await baseInformationCollection.countDocuments({
        projectId: projectId
    });
    if (count >= 1) {
        await baseInformationCollection.deleteMany({
            projectId: projectId
        })
    }

    await baseInformationVectorStore.addDocuments(documentsWithMetadata);
}

export async function embedKnowledge(newAdvice, projectId) {

    const document = new Document({
        pageContent: newAdvice,
        metadata: {
            projectId: new mongoose.Types.ObjectId(projectId),
            category: "knowledge"
        }
    });

    await baseInformationVectorStore.addDocuments([document]);
}

