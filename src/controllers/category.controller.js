import categoryModel from "../models/category.model.js";

const getAllCategories = async (req, res) => {
	try {
		const categories = await categoryModel.find().lean();
		res.render("categories", {
			categories,
			info: {
				title: "Category List",
			},
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

const buildCategoryPayload = (body) => {
	const payload = {
		id: body.id || Date.now(),
		name: body.categoryName || body.name || "",
		description: body.categoryDescription || body.description || "",
		color: body.categoryColor || body.color || "#3498db",
		icon: body.categoryIcon || body.icon || "fa-tag",
		status: body.categoryStatus || body.status || "active",
	};
	return payload;
};

const createCategory = async (req, res) => {
	try {
		const payload = buildCategoryPayload(req.body);
		const newCategory = new categoryModel(payload);
		await newCategory.save();
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, category: newCategory });
		}
		res.redirect("/categories");
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const payload = buildCategoryPayload(req.body);
		// Try to update by custom `id` field first, fall back to Mongo _id
		let updated = await categoryModel.findOneAndUpdate(
			{ id: Number(id) },
			payload,
			{
				new: true,
			},
		);
		if (!updated) {
			// attempt to treat param as MongoDB _id
			updated = await categoryModel.findByIdAndUpdate(id, payload, {
				new: true,
			});
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, category: updated });
		}
		res.redirect("/categories");
	} catch (error) {
		res.status(500).send(error);
	}
};

const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;
		let result = await categoryModel.findOneAndDelete({ id: Number(id) });
		if (!result) {
			result = await categoryModel.findByIdAndDelete(id);
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true });
		}
		res.redirect("/categories");
	} catch (error) {
		res.status(500).send(error);
	}
};

// API endpoint to get all categories as JSON (for use in other pages like products)
const getCategoriesApi = async (req, res) => {
	try {
		const categories = await categoryModel.find().lean();
		res.json({ success: true, categories });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoriesApi,
};
