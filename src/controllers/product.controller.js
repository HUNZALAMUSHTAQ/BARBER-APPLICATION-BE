const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Product } = require('../models');
const catchAsync = require('../utils/catchAsync');

const createProduct = catchAsync(async (req, res) => {
  const {  stars, description, name, price, stock, imageUrl } = req.body;
  const user = req.user.id;
  const product = await Product.create({ user, stars, description, name, price, stock, imageUrl });

  res.status(httpStatus.CREATED).send(product);
});

const getProductById = catchAsync(async (req, res) => {

  const productId = req.params.productId;
  console.log(productId);
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send(product);
});
const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find();
  res.status(httpStatus.OK).send(products);
});

const getAllProductsOfUsers = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const products = await Product.find({ user: userId });
    res.status(httpStatus.OK).send(products);
  });

const updateProductById = catchAsync(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  console.log(product, req.user.id);
  if (product.user.toString() !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to change this product');
  }
  Object.assign(product, req.body);
  await product.save();

  res.status(httpStatus.OK).send(product);
});

const deleteProductById = catchAsync(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this product');
  }
  await product.remove();

  res.status(httpStatus.OK).send({ message: 'Product deleted successfully' });
});

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
  getAllProductsOfUsers,
};
