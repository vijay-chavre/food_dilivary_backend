import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Product from '../../../models/v1/Product/productModel';
import Category from '../../../models/v1/Product/categoryModel';
import Brand from '../../../models/v1/Product/brandModel';
import Supplier from '../../../models/v1/Product/supplier';
import { attachPagination } from '../../../utils/paginatedResponse';

interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

function buildQuery(options: QueryOptions) {
  const { page = 1, limit = 10, search = '', startDate, endDate } = options;

  const startIndex = (page - 1) * limit;
  const searchFilters = [];

  if (search) {
    searchFilters.push({ name: { $regex: search, $options: 'i' } });
  }

  if (startDate && endDate) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    searchFilters.push({
      createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
    });
  }

  return { filters: searchFilters, startIndex, limit, page };
}

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
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  // Build query object with optional search and date range filters
  let query = {};
  const searchFilters = [];

  // Category filter
  if (req.query.category) {
    searchFilters.push({ category: req.query.category });
  }
  // Brand filter
  if (req.query.brand) {
    searchFilters.push({ brand: req.query.brand });
  }

  // Combine search filters using $or operator (if any filters exist)
  if ([...filters, ...searchFilters].length > 0) {
    query = { $or: [...filters, ...searchFilters] };
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

// Supplier Controller

export const createSupplier = asyncHandler(async (req, res, next) => {
  const { name, mobile, address, bankDetails, gst } = req.body;

  // add validations
  if (
    [name, mobile, address.village, gst?.gstNo].some(
      (field) => !field || field === ''
    )
  ) {
    throw new CustomError('Please fill all the fields', 400);
  }
  // check if supplier alrddy exist
  const existingSupplier = await Supplier.findOne({
    $or: [{ name }, { 'gst.gstNo': gst.gstNo }],
  });

  if (existingSupplier) {
    throw new CustomError('Supplier already exists', 400);
  }

  const newSupplier = new Supplier({
    name,
    mobile,
    address: {
      village: address.village,
      state: address.state,
      city: address.city,
      pincode: address.pincode,
      addressLine1: address.addressLine1,
    },
    bankDetails: {
      bankName: bankDetails.bankName,
      accountNo: bankDetails.accountNo,
      ifscCode: bankDetails.ifscCode,
      accountType: bankDetails.accountType,
    },
    gst: {
      gstNo: gst.gstNo,
      gstType: gst.gstType,
    },
  });

  const savedSupplier = await newSupplier.save();

  sendSuccess(res, savedSupplier, 201);
});

export const getSuppliers = asyncHandler(async (req, res, next) => {
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const supplier = await Supplier.find(query)
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Supplier.countDocuments(query);
  const paginatedResponse = attachPagination(supplier, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
  sendSuccess(res, supplier, 200);
});
