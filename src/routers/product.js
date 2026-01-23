import { Router } from 'express';
import { getAllProducts, getProductForm, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';

const router = Router();

// Sample route to get all products
router.get('/', getAllProducts);
router.get('/add', getProductForm);
router.post('/add', createProduct);
router.post('/update/:id', updateProduct);
router.post('/delete/:id', deleteProduct);

export default router;