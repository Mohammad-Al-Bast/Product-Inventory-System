import { Router } from 'express';

const router = Router();

// Sample route to get all products
router.get('/products', getAllProducts);

export default router;