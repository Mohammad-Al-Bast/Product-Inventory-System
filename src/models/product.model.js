import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		sku: { type: String, require: true, unique: true },
		category: { type: String, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
		supplier_id: { type: Number, required: true },
		description: { type: String, required: false },
	},
	{ timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;