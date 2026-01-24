import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		id: { type: Number, required: true, unique: true },
		name: { type: String, required: true, unique: true },
		description: { type: String, required: false },
		color: { type: String, required: false, default: "#3498db" },
		icon: { type: String, required: false, default: "fa-tag" },
		status: {
			type: String,
			required: false,
			default: "active",
			enum: ["active", "inactive"],
		},
	},
	{ timestamps: true },
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
