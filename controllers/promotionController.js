import mongoose from "mongoose";
import ProductPromotion from "../models/ProductPromotion.js";
import Promotion from "../models/Promotion.js";
import { convertPromotionData } from "../util/formatProductPromotion.js";
import Product from "../models/Product.js";
import { deleteVectors } from "../ai/embed.js";

export const getPromotionTypes = async (req, res) => {
    try {
        const data = await Promotion.find({ active: true }).select('_id name description pathCreate').lean();
        res.status(200).json({ message: "Thành công", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '"Lỗi máy chủ' });
    }
}

const getPromotionTypesByValue = async (value) => {
    try {
        const data = await Promotion.findOne({ active: true, value });
        return data._id;
    } catch (err) {
        console.error(err);
    }
}

export const createDiscountPromotion = async (req, res) => {
    try {
        const promotionId = await getPromotionTypesByValue("discount-value");
        const { projectId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        if (!name || !startTime || !endTime || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }


        const newPromotion = new ProductPromotion({
            projectId,
            name,
            startTime,
            endTime,
            promotion: promotionId,
            productApply: productApply.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                promoteType: item.promoteType,
                promotePricing: item.promotePricing
            }))
        });

        await newPromotion.save();

        res.status(200).json({ message: "Thành công", data: newPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

export const createComboPromotion = async (req, res) => {
    try {
        const promotionId = await getPromotionTypesByValue("combo-value");
        const { projectId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        if (!name || !startTime || !endTime || !promotionId || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        const newPromotion = new ProductPromotion({
            projectId,
            name,
            startTime,
            endTime,
            promotion: promotionId,
            productApply: productApply.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                promoteType: item.promoteType,
                promotePricing: item.promotePricing
            }))
        });

        await newPromotion.save();

        res.status(200).json({ message: "Thành công", data: newPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

export const updateDiscountPromotion = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        if (!name || !startTime || !endTime || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Tìm chương trình khuyến mãi
        const promotion = await ProductPromotion.findOne({ _id: promotionId, projectId });

        if (!promotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        // Cập nhật thông tin
        promotion.name = name;
        promotion.startTime = startTime;
        promotion.endTime = endTime;
        promotion.productApply = productApply.map(item => ({
            productId: new mongoose.Types.ObjectId(item.productId),
            promoteType: item.promoteType,
            promotePricing: item.promotePricing
        }));

        // Lưu và kích hoạt middleware
        await deleteVectors(promotion.vectorIds)
        await promotion.save();

        res.status(200).json({ message: "Cập nhật thành công", data: promotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


export const createBlukPromotion = async (req, res) => {
    try {
        const promotionId = await getPromotionTypesByValue("bluk-value");
        const { projectId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        // Validate required fields
        if (!name || !startTime || !endTime || !promotionId || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Check that each productApply has the required fields
        const invalidProductApply = productApply.some(item =>
            !item.productId ||
            !item.promoteTarget ||
            item.promoteType !== "percent" ||
            !item.promotePricing
        );

        if (invalidProductApply) {
            return res.status(400).json({ message: "Thông tin sản phẩm không hợp lệ" });
        }

        // Create the new promotion
        const newPromotion = new ProductPromotion({
            projectId,
            name,
            startTime,
            endTime,
            promotion: promotionId,
            productApply: productApply.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),  // Ensure it matches the field name used in schema
                promoteTarget: item.promoteTarget,
                promoteType: item.promoteType,
                promotePricing: item.promotePricing
            }))
        });

        await newPromotion.save();

        res.status(200).json({ message: "Thành công", data: newPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const updateBulkPromotion = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        // Validate required fields
        if (!name || !startTime || !endTime || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Check that each productApply has the required fields
        const invalidProductApply = productApply.some(item =>
            !item.productId ||
            !item.promoteTarget ||
            item.promoteType !== "percent" ||
            !item.promotePricing
        );

        if (invalidProductApply) {
            return res.status(400).json({ message: "Thông tin sản phẩm không hợp lệ" });
        }

        // Find the existing promotion
        const existingPromotion = await ProductPromotion.findOne({ _id: promotionId, projectId });

        if (!existingPromotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        // Update promotion details
        existingPromotion.name = name;
        existingPromotion.startTime = startTime;
        existingPromotion.endTime = endTime;

        // Update productApply details
        existingPromotion.productApply = productApply.map(item => ({
            productId: new mongoose.Types.ObjectId(item.productId),  // Ensure it matches the field name used in schema
            promoteTarget: item.promoteTarget,
            promoteType: item.promoteType,
            promotePricing: item.promotePricing
        }));
        await deleteVectors(existingPromotion.vectorIds);
        // Save the updated promotion
        await existingPromotion.save();

        res.status(200).json({ message: "Cập nhật thành công", data: existingPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


export const createGiftPromotion = async (req, res) => {
    try {
        const promotionId = await getPromotionTypesByValue("gift-value");
        const { projectId } = req.params;
        // Extract required data from request body
        const { name, startTime, endTime, productApply } = req.body;

        // Validate input data
        if (!name || !startTime || !endTime || !promotionId || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Validate that each item in productApply contains necessary fields
        for (let item of productApply) {
            if (!item.productId || !item.promoteTarget || !Array.isArray(item.productGift)) {
                return res.status(400).json({ message: "Thông tin sản phẩm không hợp lệ" });
            }
        }

        // Create a new ProductPromotion document
        const newPromotion = new ProductPromotion({
            projectId,
            name,
            startTime,
            endTime,
            promotion: promotionId,
            productApply: productApply.map(item => ({
                productId: new mongoose.Types.ObjectId(item.productId),
                promoteTarget: item.promoteTarget,
                productGift: item.productGift.map(g => new mongoose.Types.ObjectId(g))
            }))
        });

        // Save the new promotion to the database
        await newPromotion.save();

        // Return a success response with the created promotion data
        res.status(200).json({ message: "Thành công", data: newPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const updateGiftPromotion = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;
        const { name, startTime, endTime, productApply } = req.body;

        // Validate input data
        if (!name || !startTime || !endTime || !promotionId || !Array.isArray(productApply)) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Validate that each item in productApply contains necessary fields
        const invalidProductApply = productApply.some(item =>
            !item.productId || !item.promoteTarget || !Array.isArray(item.productGift)
        );

        if (invalidProductApply) {
            return res.status(400).json({ message: "Thông tin sản phẩm không hợp lệ" });
        }

        // Find the existing promotion
        const existingPromotion = await ProductPromotion.findOne({ _id: promotionId, projectId });

        if (!existingPromotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        // Update promotion details
        existingPromotion.name = name;
        existingPromotion.startTime = startTime;
        existingPromotion.endTime = endTime;

        // Update productApply details
        existingPromotion.productApply = productApply.map(item => ({
            productId: new mongoose.Types.ObjectId(item.productId),
            promoteTarget: item.promoteTarget,
            productGift: item.productGift.map(gift => new mongoose.Types.ObjectId(gift))
        }));

        await deleteVectors(existingPromotion.vectorIds);

        // Save the updated promotion
        await existingPromotion.save();

        // Return success response with the updated promotion data
        res.status(200).json({ message: "Cập nhật thành công", data: existingPromotion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getPromotionGiftById = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;

        const promotion = await ProductPromotion.findOne({ _id: promotionId, projectId })
            .lean();

        if (!promotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }


        // Step 1: process data
        const productApply = [];
        const productList = [];

        promotion.productApply.forEach(p => {
            const exists = productApply.some(g => g.promoteTarget === p.promoteTarget);
            if (!exists) {
                productApply.push({
                    promoteTarget: p.promoteTarget,
                    productGift: p.productGift // include this if needed
                });
            }
        });

        promotion.productApply.forEach(p => {
            const existsInApply = productApply.some(g => g.promoteTarget === p.promoteTarget);
            const alreadyInProduct = productList.some(prod => prod.toString() === p.productId.toString())

            if (existsInApply && !alreadyInProduct) {
                productList.push(p.productId);
            }
        });

        // Step 2: product format
        const products = await Product.find({ _id: { $in: productList } }).lean();

        const formattedProducts = products.map(product => {
            // collect all photoUrls (allow duplicate)

            if (product.variant.length >= 1) {
                const photoUrls = product.variant?.map(variant => variant.photoUrl).filter(Boolean) || [];

                // collect all prices, remove duplicates, sort ascending
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

        // Step 3: product gift format
        // Flatten all productGift ObjectIds into a single array
        const allProductGiftIds = productApply.reduce((acc, p) => {
            return [...acc, ...p.productGift];
        }, []);

        // Remove duplicates (if any)
        const uniqueProductGiftIds = [...new Set(allProductGiftIds.map(id => id.toString()))]; // Ensure unique ObjectIds

        // Query the Product collection for all the products with these ObjectIds
        const productsTwo = await Product.find({ _id: { $in: uniqueProductGiftIds } }).lean();

        // Create a map of ObjectId to product for quick lookup
        const productMap = productsTwo.reduce((map, product) => {
            map[product._id.toString()] = product; // Using stringified ObjectId for quick lookup
            return map;
        }, {});

        // Replace each ObjectId with the corresponding product object
        const updatedProductApply = productApply.map(p => {
            const updatedProductGift = p.productGift.map(productId => {
                // Look up the product from the map using the stringified ObjectId
                return productMap[productId.toString()];
            });

            const formattedProductsTwo = updatedProductGift.map(product => {
                // collect all photoUrls (allow duplicate)

                if (product.variant.length >= 1) {
                    const photoUrls = product.variant?.map(variant => variant.photoUrl).filter(Boolean) || [];

                    // collect all prices, remove duplicates, sort ascending
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

            return {
                promoteTarget: p.promoteTarget,
                productGift: formattedProductsTwo // Now, the productGift is an array of product objects
            };
        });

        console.log(updatedProductApply)


        const formatResponse = {
            _id: promotion._id,
            name: promotion.name,
            startTime: promotion.startTime,
            endTime: promotion.endTime,
            product: formattedProducts,
            productApply: updatedProductApply,
        }

        res.status(200).json({ message: "Thành công", data: formatResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getPromotionBlukById = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;

        const promotion = await ProductPromotion.findOne({ _id: promotionId, projectId })
            .lean();

        if (!promotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        console.log(promotion)
        // Step 1: process data
        const productApply = [];
        const productList = [];

        promotion.productApply.forEach(p => {
            const exists = productApply.some(g => g.promoteTarget === p.promoteTarget);
            if (!exists) {
                productApply.push({
                    promoteTarget: p.promoteTarget,
                    promoteType: p.promoteType,
                    promotePricing: p.promotePricing
                });
            }
        });

        promotion.productApply.forEach(p => {
            const existsInApply = productApply.some(g => g.promoteTarget === p.promoteTarget);
            const alreadyInProduct = productList.some(prod => prod.toString() === p.productId.toString())

            if (existsInApply && !alreadyInProduct) {
                productList.push(p.productId);
            }
        });

        console.log(productList)
        // Step 2: product format
        const products = await Product.find({ _id: { $in: productList } }).lean();

        const formattedProducts = products.map(product => {
            // collect all photoUrls (allow duplicate)

            if (product.variant.length >= 1) {
                const photoUrls = product.variant?.map(variant => variant.photoUrl).filter(Boolean) || [];

                // collect all prices, remove duplicates, sort ascending
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

        const formatResponse = {
            _id: promotion._id,
            name: promotion.name,
            startTime: promotion.startTime,
            endTime: promotion.endTime,
            product: formattedProducts,
            productApply: productApply,
        }

        res.status(200).json({ message: "Thành công", data: formatResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getPromotionComboAndDiscountById = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;

        // Step 0: Fetch promotion with populated products
        const promotion = await ProductPromotion.findOne({ _id: promotionId, projectId })
            .populate("productApply.productId")
            .lean();

        if (!promotion) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        // Step 1: Extract and format product data
        const productApply = [];

        promotion.productApply.forEach(p => {

            if (p.productId) {
                // Format each product here
                const product = p.productId;

                let photoUrls = [];
                let prices = [];

                if (product.variant && product.variant.length > 0) {
                    photoUrls = product.variant.map(v => v.photoUrl).filter(Boolean);

                    const priceSet = new Set();
                    product.variant.forEach(v => {
                        if (typeof v.price === "number") priceSet.add(v.price);
                    });

                    prices = Array.from(priceSet).sort((a, b) => a - b);
                } else {
                    if (product.basePhotoUrl) {
                        photoUrls = [product.basePhotoUrl];
                    }
                    if (typeof product.basePrice === "number") {
                        prices = [product.basePrice];
                    }
                }

                productApply.push({
                    promoteTarget: p.promoteTarget,
                    promoteType: p.promoteType,
                    promotePricing: p.promotePricing,
                    product: {
                        _id: product._id,
                        name: product.name,
                        active: product.active,
                        numberOfVariants: product.variant?.length || 0,
                        photoUrls,
                        prices
                    }
                });
            }
        });

        const formatResponse = {
            _id: promotion._id,
            name: promotion.name,
            startTime: promotion.startTime,
            endTime: promotion.endTime,
            productApply,
        }

        // Step 2: Return formatted response
        res.status(200).json({
            message: "Thành công",
            data: formatResponse
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};
export const deletePromotionById = async (req, res) => {
    try {
        const { projectId, promotionId } = req.params;
        const promotion = await ProductPromotion.findOne({ projectId: new mongoose.Types.ObjectId(projectId), _id: promotionId });
        // Delete the promotion
        await ProductPromotion.deleteOne({ projectId: new mongoose.Types.ObjectId(projectId), _id: promotionId });
        await deleteVectors(promotion.vectorIds)

        // Return success response
        res.status(200).json({ message: "Chương trình khuyến mãi đã được xóa thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};


export const getPromotionsByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params; // Get projectId from the route params
        const { promotionTypeId } = req.query; // Get promotionId from the query parameters (optional)

        // Build query object
        let query = { projectId };

        // If promotionId is provided, add it to the query filter
        if (promotionTypeId) {
            query.promotion = promotionTypeId;
        }

        // Find promotions based on the query object
        const promotions = await ProductPromotion.find(query)
            .populate('promotion', 'name')  // Populate the 'promotion' field with the 'name' from the Promotion model
            .populate('productApply.productId', 'name')  // Populate the productId with product names
            .populate('productApply.productGift', 'name')  // Populate productGift with product names
            .sort({ createdAt: -1 });

        // If no promotions are found, return a 404
        if (promotions.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy chương trình khuyến mãi" });
        }

        // Return success response with the promotions data
        res.status(200).json({ message: "Thành công", data: promotions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
}
