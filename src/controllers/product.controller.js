import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import supplierModel from "../models/supplier.model.js";

const getAllProducts = async (req, res) => {
	try {
		const products = await productModel.find().lean();
		const categories = await categoryModel
			.find({ status: "active" })
			.lean();
		const suppliers = await supplierModel.find().lean();
		res.render("products", {
			products,
			categories,
			suppliers,
			info: {
				title: "Product List",
			},
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

const getProductForm = (req, res) => {
	const productData = req.body || {};
	res.render("addProduct", {
		info: { title: "Add New Product" },
		productData,
	});
};

const buildPayloadFromBody = (body) => {
	const payload = {
		id: body.id || Date.now().toString(),
		name: body.productName || body.name || "",
		sku: body.productSKU || body.sku || "",
		category: body.productCategory || body.category || "",
		price: Number(body.productPrice || body.price) || 0,
		quantity: Number(body.productQuantity || body.quantity) || 0,
		supplier: body.productSupplier || body.supplier || "",
		description: body.productDescription || body.description || "",
	};
	return payload;
};

const createProduct = async (req, res) => {
	try {
		const payload = buildPayloadFromBody(req.body);
		const newProduct = new productModel(payload);
		await newProduct.save();
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, product: newProduct });
		}
		res.redirect("/products");
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const payload = buildPayloadFromBody(req.body);
		// Try to update by custom `id` field first, fall back to Mongo _id
		let updated = await productModel.findOneAndUpdate({ id }, payload, {
			new: true,
		});
		if (!updated) {
			// attempt to treat param as MongoDB _id
			updated = await productModel.findByIdAndUpdate(id, payload, {
				new: true,
			});
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, product: updated });
		}
		res.redirect("/products");
	} catch (error) {
		res.status(500).send(error);
	}
};

const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		let result = await productModel.findOneAndDelete({ id });
		if (!result) {
			result = await productModel.findByIdAndDelete(id);
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true });
		}
		res.redirect("/products");
	} catch (error) {
		res.status(500).send(error);
	}
};

export {
	getAllProducts,
	getProductForm,
	createProduct,
	updateProduct,
	deleteProduct,
};
