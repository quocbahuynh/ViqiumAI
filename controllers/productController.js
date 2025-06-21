import mongoose from "mongoose";
import Product from "../models/Product.js";
import Classification from "../models/Classification.js";
import ValueClassification from "../models/ValueClassification.js";
import { baseInformationCollection } from "../mongovector.js";
import ImageEmbed from "../models/ImageEmbed.js";


export const createProduct = async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { name, description, basePrice, basePhotoUrl, variant } = req.body;

    const classificationOps = [];
    const valueClassificationOps = [];

    if (variant && Array.isArray(variant)) {
        for (const variantItem of variant) {
            if (!variantItem.classifications) continue;
            for (const classification of variantItem.classifications) {
                classificationOps.push({
                    updateOne: {
                        filter: { _id: classification.classificationId },
                        update: {
                            $setOnInsert: {
                                projectId,
                                _id: classification.classificationId,
                                label: classification.label,
                                aidescription: classification.aidescription,
                                value: classification.value,
                                typeRoles: classification.typeRoles,
                            }
                        },
                        upsert: true
                    }
                });

                valueClassificationOps.push({
                    updateOne: {
                        filter: { _id: classification.valueClassificationId },
                        update: {
                            $setOnInsert: {
                                _id: classification.valueClassificationId,
                                label: classification.valueLabel,
                                aidescription: classification.valueAidescription,
                                value: classification.valueValue,
                                classificationId: classification.classificationId,
                                typeRoles: classification.valueTypeRoles,
                            }
                        },
                        upsert: true
                    }
                });
            }
        }
    }

    if (classificationOps.length > 0) await Classification.bulkWrite(classificationOps);
    if (valueClassificationOps.length > 0) await ValueClassification.bulkWrite(valueClassificationOps);

    const newProductInfo = new Product({
        projectId,
        name,
        description,
        basePrice,
        basePhotoUrl,
        variant,
    });

    await newProductInfo.save();
    return res.status(201).json({ success: true, product: newProductInfo });
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { projectId, name, description, basePrice, variant } = req.body;

    const existingProductInfo = await Product.findById(productId);

    if (!existingProductInfo) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const classificationOps = [];
    const valueClassificationOps = [];

    if (variant && Array.isArray(variant)) {
        for (const variantItem of variant) {
            if (!variantItem.classifications) continue;
            for (const classification of variantItem.classifications) {
                classificationOps.push({
                    updateOne: {
                        filter: { _id: classification.classificationId },
                        update: {
                            $setOnInsert: {
                                _id: classification.classificationId,
                                label: classification.label,
                                aidescription: classification.aidescription,
                                value: classification.value,
                                typeRoles: classification.typeRoles,
                            }
                        },
                        upsert: true
                    }
                });

                valueClassificationOps.push({
                    updateOne: {
                        filter: { _id: classification.valueClassificationId },
                        update: {
                            $setOnInsert: {
                                _id: classification.valueClassificationId,
                                label: classification.valueLabel,
                                aidescription: classification.valueAidescription,
                                value: classification.value,
                                classificationId: classification.classificationId,
                                typeRoles: classification.valueTypeRoles,
                            }
                        },
                        upsert: true
                    }
                });
            }
        }
    }

    if (classificationOps.length > 0) await Classification.bulkWrite(classificationOps);
    if (valueClassificationOps.length > 0) await ValueClassification.bulkWrite(valueClassificationOps);

    existingProductInfo.projectId = projectId ?? existingProductInfo.projectId;
    existingProductInfo.name = name ?? existingProductInfo.name;
    existingProductInfo.description = description ?? existingProductInfo.description;
    existingProductInfo.basePrice = basePrice ?? existingProductInfo.basePrice;
    existingProductInfo.variant = variant ?? existingProductInfo.variant;

    await existingProductInfo.save();
    return res.status(200).json({ success: true, product: existingProductInfo });
};

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    await Promise.all([
        Product.findByIdAndDelete(productId),
        ImageEmbed.deleteMany({ productId }),
        baseInformationCollection.deleteOne({ productId: new mongoose.Types.ObjectId(productId) })
    ]);

    res.status(200).json({ message: "Xóa sản phẩm thành công" });
};

export const getProducts = async (req, res) => {
    const { projectId } = req.params;

    const products = await Product.find({ projectId: new mongoose.Types.ObjectId(projectId) }).sort({ createdAt: -1 }).lean();
    const formattedProducts = products.map(product => {
        if (product.variant.length >= 1) {
            const photoUrls = product.variant?.map(variant => variant.photoUrl).filter(Boolean) || [];

            const pricesSet = new Set();
            product.variant?.forEach(variant => {
                if (typeof variant.price === "number") {
                    pricesSet.add(variant.price);
                }
            });
            const prices = Array.from(pricesSet).sort((a, b) => a - b);

            return {
                _id: product._id,
                name: product.name,
                active: product.active,
                numberOfVariants: product.variant?.length || 0,
                photoUrls,
                prices
            };
        } else {
            return {
                _id: product._id,
                name: product.name,
                active: product.active,
                numberOfVariants: 0,
                photoUrls: [product.basePhotoUrl],
                prices: [product.basePrice]
            };
        }
    });

    res.status(200).json({ message: "Thành công", data: formattedProducts });
}

export const getProductById = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID.' });
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    const populatedVariants = await Product.findById(productId)
        .populate('variant.classifications.classificationId')
        .populate('variant.classifications.valueClassificationId')
        .lean();

    const classificationMap = {}; 
    populatedVariants.variant.forEach((variantItem) => {
        variantItem.classifications.forEach((c) => {
            if (c.classificationId && c.valueClassificationId) {
                const classificationId = c.classificationId._id.toString();
                if (!classificationMap[classificationId]) {
                    classificationMap[classificationId] = {
                        _id: classificationId,
                        label: c.classificationId.label,
                        value: c.classificationId.value,
                        name: c.classificationId.label,
                        options: [],
                    };
                }
                const alreadyExists = classificationMap[classificationId].options.some(
                    (opt) => opt._id === c.valueClassificationId._id.toString()
                );
                if (!alreadyExists) {
                    classificationMap[classificationId].options.push({
                        _id: c.valueClassificationId._id.toString(),
                        label: c.valueClassificationId.label,
                        value: c.valueClassificationId.value,
                        count: undefined, 
                        isCustom: false, 
                    });
                }
            }
        });
    });
    const classifications = Object.values(classificationMap);

    const formattedVariants = populatedVariants.variant.map((variantItem) => {
        const formattedClassifications = variantItem.classifications.map((c) => {
            return {
                classificationId: c.classificationId ? c.classificationId._id.toString() : undefined,
                valueClassificationId: c.valueClassificationId ? c.valueClassificationId._id.toString() : undefined,
                label: c.classificationId ? c.classificationId.label : '',
                aideDescription: c.classificationId ? c.classificationId.aideDescription : '',
                value: c.classificationId ? c.classificationId.value : '',
                typeRoles: c.classificationId ? c.classificationId.typeRoles : '',
                valueValue: c.valueClassificationId ? c.valueClassificationId.value : '',
                valueLabel: c.valueClassificationId ? c.valueClassificationId.label : '',
                valueAideDescription: c.valueClassificationId ? c.valueClassificationId.aideDescription : '',
                valueTypeRoles: c.valueClassificationId ? c.valueClassificationId.typeRoles : '',
            };
        });

        return {
            photoUrl: variantItem.photoUrl,
            classifications: formattedClassifications,
            price: variantItem.price || 0,
        };
    });

    const formProductData = {
        name: product.name,
        description: product.description || '',
        basePhotoUrl: product.basePhotoUrl,
        basePrice: product.basePrice,
        classifications,
        variants: formattedVariants,
    };

    res.status(200).json(formProductData);
};

export const searchProducts = async (req, res) => {
    const { query, projectId } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm", data: [] });
    }

    if (!projectId) {
        return res.status(200).json({ message: "Thành công", data: [] });
    }

    const conditions = {
        projectId: projectId, 
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ]
    };

    const products = await Product.find(conditions).select("_id name").limit(10).lean();
    res.status(200).json({ message: "Thành công", data: products });
};
