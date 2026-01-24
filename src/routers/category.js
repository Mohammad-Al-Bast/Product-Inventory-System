import { Router } from "express";
import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoriesApi,
} from "../controllers/category.controller.js";

const router = Router();

// Category routes
router.get("/", getAllCategories);
router.get("/api", getCategoriesApi);
router.post("/add", createCategory);
router.post("/update/:id", updateCategory);
router.post("/delete/:id", deleteCategory);

export default router;
