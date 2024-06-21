import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Product from '../../../models/v1/Product/productModel';
import Category from '../../../models/v1/Product/categoryModel';
import Brand from '../../../models/v1/Product/brandModel';
import { get } from 'http';

// write utl that checks json fields validation and empty or undefined

// Product Routes
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, category, brand, unit } = req.body;
  // add validations
  if (
    [name, price, category, brand, unit].some((field) => !field || field === '')
  ) {
    throw new CustomError('Please fill all the fields', 400);
  }
  // check if product exists
  const product = await Product.findOne({ name });
  if (product) {
    throw new CustomError('Product already exists', 400);
  }
  // create product
  const newProduct = new Product({
    name,
    description,
    price,
    image,
    category,
    brand,
    unit,
  });

  await newProduct.save();
  sendSuccess(res, newProduct, 200);
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find()
    .populate('category', 'name')
    .populate('brand', 'name');
  sendSuccess(res, products, 200);
});

// Category controller

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // add validations
  if ([name, description].some((field) => !field || field === '')) {
    throw new CustomError('Please fill all the fields', 400);
  }
  // check if category exists
  const category = await Category.findOne({ name });
  if (category) {
    throw new CustomError('Category already exists', 400);
  }
  // create category
  const newCategory = new Category({
    name,
    description,
  });
  await newCategory.save();
  sendSuccess(res, newCategory, 200);
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  sendSuccess(res, categories, 200);
});

// Brand Controller

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // add validations
  if ([name, description].some((field) => !field || field === '')) {
    throw new CustomError('Please fill all the fields', 400);
  }
  // check if category exists
  const category = await Brand.findOne({ name });
  if (category) {
    throw new CustomError('Brand already exists', 400);
  }
  // create category
  const newBrand = new Brand({
    name,
    description,
  });
  await newBrand.save();
  sendSuccess(res, newBrand, 200);
});

export const getBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();
  sendSuccess(res, brands, 200);
});
