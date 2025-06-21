import express from 'express';
import { createProduct, deleteProduct,getProductById, getProducts, searchProducts, updateProduct } from '../controllers/productController.js';
import authenticateJWT from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';
import { validate } from '../middleware/validate.js';
import { productSchema } from '../schemas/productSchema.js';
const router = express.Router();

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Search for products by name or description within a project
 *     description: >
 *       Search for products whose name or description partially matches the query string (case-insensitive),
 *       filtered by projectId. Maximum 10 results will be returned.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The keyword to search in product name and description.
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project to filter products.
 *     responses:
 *       200:
 *         description: Search completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: array
 *                   maxItems: 10
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "661abcf1234abcd567efgh89"
 *                       name:
 *                         type: string
 *                         example: "Sản phẩm A"
 *       400:
 *         description: Missing search keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu từ khóa tìm kiếm
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/search', authenticateJWT, asyncHandler(searchProducts))

/**
 * @swagger
 * /api/product/list/{projectId}:
 *   get:
 *     summary: Get list of products by projectId
 *     description: |
 *       Fetches all products belonging to a specific project.  
 *       Returns name, active status, number of variants, photo URLs, and sorted unique prices for each product.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the project to retrieve products for
 *     responses:
 *       200:
 *         description: Successful response with a list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 680b0d3b8fbe7a6ea11595d1
 *                       name:
 *                         type: string
 *                         example: Product A
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       numberOfVariants:
 *                         type: integer
 *                         example: 4
 *                       photoUrls:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: https://example.com/photo1.jpg
 *                       prices:
 *                         type: array
 *                         items:
 *                           type: number
 *                           example: 100.0
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/list/:projectId', authenticateJWT, asyncHandler(getProducts));

/**
 * @swagger
 * /api/product/{projectId}:
 *   post:
 *     summary: Create a new product with variants, classifications, and value classifications.
 *     description: This endpoint creates a new product and automatically creates or reuses existing classifications and value classifications.
 *     tags: [Product]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project this product belongs to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - basePrice
 *               - variant
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: A description of the product (optional).
 *               basePrice:
 *                 type: number
 *                 description: The base price of the product.
 *               variant:
 *                 type: array
 *                 description: A list of variants for the product.
 *                 items:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                       description: The URL of the product image.
 *                     classifications:
 *                       type: array
 *                       description: A list of classifications for this variant.
 *                       items:
 *                         type: object
 *                         properties:
 *                           classificationId:
 *                             type: string
 *                             description: The ID of the classification.
 *                           valueClassificationId:
 *                             type: string
 *                             description: The ID of the value classification.
 *                           label:
 *                             type: string
 *                             description: The label for the classification.
 *                           aideDescription:
 *                             type: string
 *                             description: The aide description for the classification.
 *                           value:
 *                             type: string
 *                             description: The value associated with the classification.
 *                           typeRoles:
 *                             type: string
 *                             description: The role of the classification (user/system).
 *                           valueValue:
 *                             type: string
 *                             description: The value for the value classification.
 *                           valueLabel:
 *                             type: string
 *                             description: The label for the value classification.
 *                           valueAideDescription:
 *                             type: string
 *                             description: The aide description for the value classification.
 *                           valueTypeRoles:
 *                             type: string
 *                             description: The type role of the value classification (user/system).
 *                     price:
 *                       type: number
 *                       description: The price of the product variant.
 *     responses:
 *       '201':
 *         description: Product information created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the product was successfully created.
 *                 productInformation:
 *                   type: object
 *                   description: The created product information object.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the product.
 *                     projectId:
 *                       type: string
 *                       description: The ID of the project this product belongs to.
 *                     name:
 *                       type: string
 *                       description: The name of the product.
 *                     description:
 *                       type: string
 *                       description: The description of the product.
 *                     basePrice:
 *                       type: number
 *                       description: The base price of the product.
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: number
 *                             description: The price of the variant.
 *                           classifications:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 classificationId:
 *                                   type: string
 *                                   description: The ID of the classification.
 *                                 valueClassificationId:
 *                                   type: string
 *                                   description: The ID of the value classification.
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the product creation failed.
 *                 message:
 *                   type: string
 *                   description: An error message describing the failure.
 */
router.post('/:projectId', authenticateJWT, validate(productSchema), asyncHandler(createProduct));


/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     summary: Update an existing Product Information with variants, classifications, and value classifications.
 *     description: This endpoint updates an existing product. It also ensures that classifications and value classifications exist or are created if missing.
 *     tags: [Product]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product information to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: The ID of the project this product belongs to (optional).
 *               name:
 *                 type: string
 *                 description: The new name of the product (optional).
 *               description:
 *                 type: string
 *                 description: A new description of the product (optional).
 *               basePrice:
 *                 type: number
 *                 description: The new base price of the product (optional).
 *               variant:
 *                 type: array
 *                 description: A new list of variants for the product (optional).
 *                 items:
 *                   type: object
 *                   properties:
 *                     photoUrl:
 *                       type: string
 *                       description: The URL of the product variant image.
 *                     classifications:
 *                       type: array
 *                       description: A list of classifications for this variant.
 *                       items:
 *                         type: object
 *                         properties:
 *                           classificationId:
 *                             type: string
 *                             description: The ID of the classification.
 *                           valueClassificationId:
 *                             type: string
 *                             description: The ID of the value classification.
 *                           label:
 *                             type: string
 *                             description: The label for the classification (optional if classification already exists).
 *                           aidescription:
 *                             type: string
 *                             description: The aide description for the classification (optional if classification already exists).
 *                           value:
 *                             type: string
 *                             description: The value associated with the classification.
 *                           typeRoles:
 *                             type: string
 *                             description: The role of the classification (user/system).
 *                           valueLabel:
 *                             type: string
 *                             description: The label for the value classification (optional if value classification already exists).
 *                           valueAidescription:
 *                             type: string
 *                             description: The aide description for the value classification (optional if value classification already exists).
 *                           valueTypeRoles:
 *                             type: string
 *                             description: The type role of the value classification (user/system).
 *                     price:
 *                       type: number
 *                       description: The price of the product variant.
 *     responses:
 *       200:
 *         description: Product information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the product was successfully updated.
 *                 productInformation:
 *                   type: object
 *                   description: The updated product information object.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the product.
 *                     projectId:
 *                       type: string
 *                       description: The ID of the project this product belongs to.
 *                     name:
 *                       type: string
 *                       description: The updated name of the product.
 *                     description:
 *                       type: string
 *                       description: The updated description of the product.
 *                     basePrice:
 *                       type: number
 *                       description: The updated base price of the product.
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           photoUrl:
 *                             type: string
 *                             description: The URL of the product variant image.
 *                           price:
 *                             type: number
 *                             description: The price of the product variant.
 *                           classifications:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 classificationId:
 *                                   type: string
 *                                   description: The ID of the classification.
 *                                 valueClassificationId:
 *                                   type: string
 *                                   description: The ID of the value classification.
 *       404:
 *         description: Product information not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: ProductInformation not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.put('/:productId', authenticateJWT, validate(productSchema), asyncHandler(updateProduct));

/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *     summary: Delete a product by its ID.
 *     description: This endpoint deletes a product by its unique `productId` and removes all related information.
 *     tags: [Product]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the product was deleted.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the product with the provided `productId` was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message describing the failure (e.g., server error).
 */
router.delete('/:productId', authenticateJWT, asyncHandler(deleteProduct));

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get a product by its ID
 *     description: Retrieve a single product by its productId, including classifications and variants.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Successful response with product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Product A
 *                     description:
 *                       type: string
 *                       example: This is a product description
 *                     basePrice:
 *                       type: number
 *                       example: 50.00
 *                     classifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 66123abc456def7890abcdef
 *                           label:
 *                             type: string
 *                             example: "Color"
 *                           value:
 *                             type: string
 *                             example: "color"
 *                           name:
 *                             type: string
 *                             example: "Color"
 *                           options:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 66123abc456def7890abcdee
 *                                 label:
 *                                   type: string
 *                                   example: "Red"
 *                                 value:
 *                                   type: string
 *                                   example: "red"
 *                                 count:
 *                                   type: integer
 *                                   nullable: true
 *                                   example: null
 *                                 isCustom:
 *                                   type: boolean
 *                                   example: false
 *                     variants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           photoUrl:
 *                             type: string
 *                             example: https://example.com/photo.jpg
 *                           classifications:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 classificationId:
 *                                   type: string
 *                                   example: 66123abc456def7890abcdef
 *                                 valueClassificationId:
 *                                   type: string
 *                                   example: 66123abc456def7890abcdee
 *                           price:
 *                             type: number
 *                             example: 99.99
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid product ID.
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/:productId', authenticateJWT, asyncHandler(getProductById));


export default router;