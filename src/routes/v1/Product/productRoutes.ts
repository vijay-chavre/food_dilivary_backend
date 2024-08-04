import express from 'express';
import requireAuth from '../../../middlewares/requireAuth';
import {
  createBrand,
  createCategory,
  createProduct,
  getBrands,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
  createSupplier,
  getSuppliers,
} from '../../../controllers/v1/Product/productController';
import {
  createStockItem,
  getStockItems,
} from '../../../controllers/v1/Product/stockController';
const router = express.Router();

// Product Routes
router.post('/products', requireAuth, createProduct);
router.put('/products/:id', requireAuth, updateProduct);
router.get('/products', requireAuth, getProducts);
router.get('/products/:id', requireAuth, getProductById);

//Stock Routes
router.post('/stocks', requireAuth, createStockItem);
router.get('/stocks', requireAuth, getStockItems);

// Category Routes
router.post('/categories', requireAuth, createCategory);
router.get('/categories', requireAuth, getCategories);

// Brand Routes
router.post('/brands', requireAuth, createBrand);
router.get('/brands', requireAuth, getBrands);

// Supplier Routes

router.post('/suppliers', requireAuth, createSupplier);
router.get('/suppliers', requireAuth, getSuppliers);

export default router;
