// Dashboard JavaScript

// Sample data - loaded from server via window.dashboardData
const dashboardData = window.dashboardData || {
	totalProducts: 0,
	totalSuppliers: 0,
	lowStockItems: 0,
	inventoryValue: 0,
};

// Chart data from server
const chartData = window.chartData || {
	categoryDistribution: {},
	stockLevels: [],
	valueByCategory: {},
};

// Chart color palette matching the project theme
const chartColors = {
	primary: "#1C4D8D",
	primaryLight: "#4988C4",
	primaryLighter: "#BDE8F5",
	primaryDark: "#0F2854",
	secondary: "#10b981",
	danger: "#ef4444",
	warning: "#f59e0b",
	purple: "#8b5cf6",
	// Extended palette for multiple categories
	palette: [
		"#1C4D8D",
		"#4988C4",
		"#10b981",
		"#8b5cf6",
		"#f59e0b",
		"#ef4444",
		"#06b6d4",
		"#ec4899",
		"#14b8a6",
		"#f97316",
	],
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
	console.log("Dashboard loaded with data:", dashboardData);
	console.log("Chart data:", chartData);

	// Initialize charts
	initCategoryChart();
	initStockChart();
});

// Category Distribution Pie Chart
function initCategoryChart() {
	const ctx = document.getElementById("categoryChart");
	if (!ctx) return;

	const labels = Object.keys(chartData.categoryDistribution);
	const data = Object.values(chartData.categoryDistribution);

	// If no data, show placeholder
	if (labels.length === 0) {
		ctx.parentElement.innerHTML =
			'<div class="chart-empty"><i class="fas fa-chart-pie"></i><p>No category data available</p></div>';
		return;
	}

	new Chart(ctx, {
		type: "doughnut",
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: chartColors.palette.slice(
						0,
						labels.length,
					),
					borderColor: "#ffffff",
					borderWidth: 3,
					hoverOffset: 10,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "right",
					labels: {
						padding: 20,
						usePointStyle: true,
						pointStyle: "circle",
						font: {
							size: 12,
							family: "'Inter', sans-serif",
						},
						color: "#0F2854",
					},
				},
				tooltip: {
					backgroundColor: "#0F2854",
					titleFont: {
						size: 14,
						family: "'Inter', sans-serif",
					},
					bodyFont: {
						size: 13,
						family: "'Inter', sans-serif",
					},
					padding: 12,
					cornerRadius: 8,
					callbacks: {
						label: function (context) {
							const total = context.dataset.data.reduce(
								(a, b) => a + b,
								0,
							);
							const percentage = (
								(context.parsed / total) *
								100
							).toFixed(1);
							return `${context.label}: ${context.parsed} products (${percentage}%)`;
						},
					},
				},
			},
			cutout: "60%",
			animation: {
				animateRotate: true,
				animateScale: true,
			},
		},
	});
}

// Stock Levels Bar Chart
function initStockChart() {
	const ctx = document.getElementById("stockChart");
	if (!ctx) return;

	const stockLevels = chartData.stockLevels || [];

	// If no data, show placeholder
	if (stockLevels.length === 0) {
		ctx.parentElement.innerHTML =
			'<div class="chart-empty"><i class="fas fa-chart-bar"></i><p>No stock data available</p></div>';
		return;
	}

	const labels = stockLevels.map((item) => item.name);
	const data = stockLevels.map((item) => item.quantity);
	const backgroundColors = stockLevels.map((item) =>
		item.isLow ? chartColors.danger : chartColors.primary,
	);
	const borderColors = stockLevels.map((item) =>
		item.isLow ? "#dc2626" : "#0F2854",
	);

	new Chart(ctx, {
		type: "bar",
		data: {
			labels: labels,
			datasets: [
				{
					label: "Stock Quantity",
					data: data,
					backgroundColor: backgroundColors,
					borderColor: borderColors,
					borderWidth: 2,
					borderRadius: 6,
					borderSkipped: false,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					backgroundColor: "#0F2854",
					titleFont: {
						size: 14,
						family: "'Inter', sans-serif",
					},
					bodyFont: {
						size: 13,
						family: "'Inter', sans-serif",
					},
					padding: 12,
					cornerRadius: 8,
					callbacks: {
						label: function (context) {
							const item = stockLevels[context.dataIndex];
							const status = item.isLow
								? "⚠️ Low Stock"
								: "✓ In Stock";
							return `Quantity: ${context.parsed.y} units ${status}`;
						},
					},
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 11,
							family: "'Inter', sans-serif",
						},
						color: "#1C4D8D",
					},
				},
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(189, 232, 245, 0.5)",
					},
					ticks: {
						font: {
							size: 12,
							family: "'Inter', sans-serif",
						},
						color: "#1C4D8D",
					},
				},
			},
			animation: {
				duration: 1000,
				easing: "easeOutQuart",
			},
		},
	});
}
