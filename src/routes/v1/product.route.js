const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(),  productController.getAllProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.prodIdParam), productController.getProductById)
  .patch(auth(), validate(productValidation.updateProduct), productController.updateProductById)
  .delete(auth(), validate(productValidation.prodIdParam), productController.deleteProductById);

router.get('/user/:userId', validate(productValidation.userIdParam), productController.getAllProductsOfUsers);

module.exports = router;


