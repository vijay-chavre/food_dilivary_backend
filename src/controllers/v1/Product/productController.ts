import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Product from '../../../models/v1/Product/productModel';
import Category from '../../../models/v1/Product/categoryModel';
import Brand from '../../../models/v1/Product/brandModel';
import { get } from 'http';
import { attachPagination } from '../../../utils/paginatedResponse';

// write utl that checks json fields validation and empty or undefined

// Product Routes
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, category, brand, unit, hsn, gst } =
    req.body;
  // add validations
  if (
    [name, price, category, brand, unit, hsn, gst].some(
      (field) => !field || field === ''
    )
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
    hsn,
    gst,
  });

  await newProduct.save();
  sendSuccess(res, newProduct, 200);
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, category, brand, unit } = req.body;
  // add validations
  if (
    [name, price, category, brand, unit].some((field) => !field || field === '')
  ) {
    throw new CustomError('Please fill all the fields', 400);
  }
  // check if product exists
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomError('Product not found', 404);
  }
  // update product
  product.name = name;
  product.description = description;
  product.price = price;
  product.image = image;
  product.category = category;
  product.brand = brand;
  product.unit = unit;
  await product.save();
  sendSuccess(res, product, 200);
});

export const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as unknown as string) || 1;
  const limit = parseInt(req.query.limit as unknown as string) || 10;
  const search = (req.query.search as unknown as string) || '';

  const startIndex = (page - 1) * limit;
  let startDate;
  let endDate;
  if (req.query.startDate && req.query.endDate) {
    try {
      startDate = new Date(req.query.startDate as unknown as string);
      endDate = new Date(req.query.endDate as unknown as string);
    } catch (error) {
      // Handle invalid date format errors (e.g., return bad request)
      return next(new Error('Invalid date format in query'));
    }
  }
  // Build query object with optional search and date range filters
  let query = {};
  const searchFilters = []; // Array to hold search and date range filters

  // Search filter (if provided)
  if (search) {
    searchFilters.push({ name: { $regex: search, $options: 'i' } });
  }

  // Date range filter (if both dates are provided)
  if (startDate && endDate) {
    searchFilters.push({ createdAt: { $gte: startDate, $lte: endDate } });
  }
  // Category filter
  if (req.query.category) {
    searchFilters.push({ category: req.query.category });
  }
  // Brand filter
  if (req.query.brand) {
    searchFilters.push({ brand: req.query.brand });
  }

  // Combine search filters using $or operator (if any filters exist)
  if (searchFilters.length > 0) {
    query = { $or: searchFilters };
  }
  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('brand', 'name')
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Product.countDocuments(query);

  const paginatedResponse = attachPagination(products, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('brand', 'name');
  if (!product) {
    throw new CustomError('Product not found', 404);
  }
  sendSuccess(res, product, 200);
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
