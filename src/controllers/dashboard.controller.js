import productModel from "../models/product.model.js";
import supplierModel from "../models/supplier.model.js";

const getDashboard = async (req, res) => {
	try {
		// Fetch all products and suppliers
		const products = await productModel.find().lean();
		const suppliers = await supplierModel.find().lean();

		// Calculate statistics
		const totalProducts = products.length;
		const totalSuppliers = suppliers.length;

		// Calculate low stock items (quantity < 20)
		const lowStockItems = products.filter((p) => p.quantity < 20);
		const lowStockCount = lowStockItems.length;

		// Calculate total inventory value
		const inventoryValue = products.reduce((sum, product) => {
			return sum + product.price * product.quantity;
		}, 0);

		// Get low stock alerts (top 3 lowest stock items)
		const alerts = lowStockItems
			.sort((a, b) => a.quantity - b.quantity)
			.slice(0, 3)
			.map((product) => ({
				...product,
				urgency: product.quantity < 10 ? "urgent" : "warning",
			}));

		// Get suggested items to restock (low stock items sorted by quantity)
		const suggestedItems = lowStockItems
			.sort((a, b) => a.quantity - b.quantity)
			.slice(0, 4);

		// Recent transactions would come from a transactions collection
		// For now, we'll create mock data based on recent product updates
		const recentTransactions = products
			.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
			.slice(0, 4)
			.map((product) => ({
				date: new Date(product.updatedAt).toLocaleString("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}),
				productName: product.name,
				sku: product.sku,
				type: "update",
				quantity: product.quantity,
				status: "completed",
			}));

		res.render("index", {
			stats: {
				totalProducts,
				totalSuppliers,
				lowStockCount,
				inventoryValue,
			},
			alerts,
			suggestedItems,
			recentTransactions,
			info: {
				title: "Dashboard",
			},
		});
	} catch (error) {
		console.error("Dashboard error:", error);
		res.status(500).send(error);
	}
};

export { getDashboard };
