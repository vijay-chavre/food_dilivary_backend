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
import { createVoucher } from '../../../controllers/v1/Product/voucherController';
import {
  createDefaultGroups,
  createGroup,
  getGroups,
} from '../../../controllers/v1/Product/groupController';
import {
  createLedger,
  getLedgers,
} from '../../../controllers/v1/Product/ledgerController';

import { lookups } from '../../../controllers/v1/Product/lookupController';
const router = express.Router();

// Product Routes
router.post('/products', requireAuth, createProduct);
router.put('/products/:id', requireAuth, updateProduct);
router.get('/products', requireAuth, getProducts);
router.get('/products/:id', requireAuth, getProductById);

//Groups Routes
router.post('/groups', requireAuth, createGroup);
router.post('/groups/default', requireAuth, createDefaultGroups);
router.get('/groups', requireAuth, getGroups);

// Ledger Routes
router.post('/ledgers', requireAuth, createLedger);
router.get('/ledgers', requireAuth, getLedgers);

// Voucher Routes
router.post('/vouchers', requireAuth, createVoucher);
router.get('/vouchers', requireAuth);

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

// Lookup Routes
router.get('/lookups/:modelName', requireAuth, lookups);

export default router;
