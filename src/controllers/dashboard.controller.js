import productModel from "../models/product.model.js";
import supplierModel from "../models/supplier.model.js";
import categoryModel from "../models/category.model.js";

const getDashboard = async (req, res) => {
	try {
		// Fetch all products, suppliers, and categories
		const products = await productModel.find().lean();
		const suppliers = await supplierModel.find().lean();
		const categories = await categoryModel.find().lean();

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

		// Category distribution for pie chart
		const categoryDistribution = {};
		products.forEach((product) => {
			const cat = product.category || "Uncategorized";
			categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
		});

		// Stock levels for bar chart (top 10 products by quantity)
		const stockLevels = products
			.sort((a, b) => b.quantity - a.quantity)
			.slice(0, 8)
			.map((p) => ({
				name:
					p.name.length > 15
						? p.name.substring(0, 15) + "..."
						: p.name,
				quantity: p.quantity,
				isLow: p.quantity < 20,
			}));

		// Inventory value by category for doughnut chart
		const valueByCategory = {};
		products.forEach((product) => {
			const cat = product.category || "Uncategorized";
			valueByCategory[cat] =
				(valueByCategory[cat] || 0) + product.price * product.quantity;
		});

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
			chartData: {
				categoryDistribution,
				stockLevels,
				valueByCategory,
			},
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
