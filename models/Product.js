import mongoose from "mongoose";
import Classification from "./Classification.js";
import ValueClassification from "./ValueClassification.js";
import { embedProduct } from "../ai/embed.js";
import ImageEmbed from "./ImageEmbed.js";
import { getVectorEmbedMutiplePhoto, getVectorEmbedPhoto } from "../ai/embedImage.js";

const ProductSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
    variant: [
        {
            photoUrl: { type: String },
            classifications: [
                {
                    classificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classification' },
                    valueClassificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ValueClassification' },
                }
            ],
            price: { type: Number },
        }
    ],
    basePhotoUrl: { type: String },
    basePrice: { type: Number },
    vectorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImageEmbed' }]
}, { timestamps: true });

export const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN');
};


ProductSchema.pre('save', async function (next) {
    try {
        const product = this;
        const productVariantPhotoObjectList = [];

        const pushProductVariantPhoto = (url, context) => {
            productVariantPhotoObjectList.push({
                photoUrl: url,
                pageContent: context
            })
        }

        const embedImagesVector = async () => {
            try {

                if (productVariantPhotoObjectList.length < 1) {
                    return [];
                }

                const count = await ImageEmbed.countDocuments({
                    category: "product",
                    projectId: product.projectId,
                    productId: product._id,
                });

                if (count >= 1) {
                    await await ImageEmbed.deleteMany({
                        category: "product",
                        projectId: product.projectId,
                        productId: product._id,
                    });
                }


                const images = productVariantPhotoObjectList.map(p => ({
                    image: p.photoUrl,
                }));

                const vectors = await getVectorEmbedMutiplePhoto(images);

                if (vectors.length !== productVariantPhotoObjectList.length) {
                    throw new Error("Vector length mismatch with photo list");
                }

                const docs = vectors.map((v, i) => new ImageEmbed({
                    category: "product",
                    projectId: product.projectId,
                    productId: product._id,
                    pageContent: productVariantPhotoObjectList[i].pageContent,
                    imageUrl: productVariantPhotoObjectList[i].photoUrl,
                    vector: v.embedding,
                }));

                const insertedDocs = await ImageEmbed.insertMany(docs);
                const insertedIds = insertedDocs.map(doc => doc._id);
                this.vectorIds = insertedDocs;
            } catch (err) {
                console.error("Error embedding images:", err);
                throw err;
            }
        };

        await product.populate([
            { path: 'variant.classifications.classificationId' },
            { path: 'variant.classifications.valueClassificationId' }
        ]);

        let formattedProductDetails = `Tên sản phẩm: ${product.name} \n`;

        if (product.basePrice) {
            formattedProductDetails += `Giá gốc: ${product.basePrice}\n`;
        }

        if (product.description || product.description === "") {
            formattedProductDetails += `Mô tả sản phẩm: ${product.description || 'Không có mô tả'}\n`;
        }

        if (product.basePhotoUrl) {
            formattedProductDetails += `Link ảnh : ${product.basePhotoUrl || 'Không có ảnh'}\n`;
            pushProductVariantPhoto(product.basePhotoUrl, formattedProductDetails);

        }

        if (product.variant && product.variant.length > 0) {
            const productVariantList = [];

            for (const variant of product.variant) {
                let productVariant = `- `;
                let productVariantContent = `Tên sản phẩm: ${product.name} \n`;

                if (variant.classifications && variant.classifications.length > 0) {

                    for (const classification of variant.classifications) {
                        const classificationDoc = classification.classificationId;
                        const valueClassificationDoc = classification.valueClassificationId;

                        if (classificationDoc && valueClassificationDoc) {
                            productVariant += ` ${classificationDoc.label}: ${valueClassificationDoc.label},`;
                            productVariantContent += `- ${classificationDoc.label}: ${valueClassificationDoc.label} \n`;
                        }
                    }
                }

                productVariant += ` Giá gốc: ${formatCurrency(variant.price)}₫ `;
                productVariantContent += `- Giá gốc: ${formatCurrency(variant.price)}₫  \n`;

                if (variant.photoUrl) {
                    productVariant += `(Link ảnh  ${variant.photoUrl})`;
                    productVariantContent += `- Link ảnh: ${variant.photoUrl} \n`;
                    pushProductVariantPhoto(variant.photoUrl, productVariantContent);
                }
                productVariantList.push(productVariant);
            }

            formattedProductDetails += "Các sự lựa chọn: \n";
            formattedProductDetails += productVariantList.join("\n");
        }
        await Promise.all([
            embedProduct(formattedProductDetails, product._id, product.projectId),
            embedImagesVector()
        ]);

        next();
    } catch (err) {
        console.error('Embedding failed:', err);
        next();
    }
});


const Product = mongoose.model("Product", ProductSchema);
export default Product;
