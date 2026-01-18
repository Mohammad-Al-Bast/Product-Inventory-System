import { Router } from "express";

const router = Router();

// Sample route to get all products
router.get("/suppliers", getAllSuppliers);

export default router;
