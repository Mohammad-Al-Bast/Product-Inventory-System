import supplierModel from "../models/supplier.model.js";

const getAllSuppliers = async (req, res) => {
	try {
		const suppliers = await supplierModel.find().lean();
		res.render("suppliers", {
			suppliers,
			info: {
				title: "Supplier List",
			},
		});
	} catch (error) {
		res.status(500).send(error);
	}
};

const buildSupplierPayload = (body) => {
	const payload = {
		id: body.id || Date.now(),
		name: body.supplierName || body.name || "",
		email: body.supplierEmail || body.email || "",
		phone: Number(body.supplierPhone || body.phone) || 0,
		website: body.supplierWebsite || body.website || "",
		address: body.supplierAddress || body.address || "",
		city: body.supplierCity || body.city || "",
		state: body.supplierState || body.state || "",
		zip: Number(body.supplierZip || body.zip) || 0,
		country: body.supplierCountry || body.country || "Lebanon",
		notes: body.supplierNotes || body.notes || "",
	};
	return payload;
};

const createSupplier = async (req, res) => {
	try {
		const payload = buildSupplierPayload(req.body);
		const newSupplier = new supplierModel(payload);
		await newSupplier.save();
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, supplier: newSupplier });
		}
		res.redirect("/suppliers");
	} catch (error) {
		res.status(500).send(error);
	}
};

const updateSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		const payload = buildSupplierPayload(req.body);
		// Try to update by custom `id` field first, fall back to Mongo _id
		let updated = await supplierModel.findOneAndUpdate(
			{ id: Number(id) },
			payload,
			{
				new: true,
			},
		);
		if (!updated) {
			// attempt to treat param as MongoDB _id
			updated = await supplierModel.findByIdAndUpdate(id, payload, {
				new: true,
			});
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true, supplier: updated });
		}
		res.redirect("/suppliers");
	} catch (error) {
		res.status(500).send(error);
	}
};

const deleteSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		let result = await supplierModel.findOneAndDelete({ id: Number(id) });
		if (!result) {
			result = await supplierModel.findByIdAndDelete(id);
		}
		if (
			req.xhr ||
			(req.headers.accept &&
				req.headers.accept.includes("application/json"))
		) {
			return res.json({ success: true });
		}
		res.redirect("/suppliers");
	} catch (error) {
		res.status(500).send(error);
	}
};

export { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier };
