import { Router } from 'express';
import { getAllProducts } from '../controllers/product.controller.js';

const router = Router();

// Sample route to get all products
router.get('/products', getAllProducts);

export default router;