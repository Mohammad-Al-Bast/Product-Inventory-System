import { Router } from "express";
import {
	getAllSuppliers,
	createSupplier,
	updateSupplier,
	deleteSupplier,
} from "../controllers/supplier.controller.js";

const router = Router();

// Supplier routes
router.get("/", getAllSuppliers);
router.post("/add", createSupplier);
router.post("/update/:id", updateSupplier);
router.post("/delete/:id", deleteSupplier);

export default router;
