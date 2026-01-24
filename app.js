import express from "express";
import connectDatabase from "./src/config/database.js";
import productRouter from "./src/routers/product.js";
import supplierRouter from "./src/routers/supplier.js";
import { getDashboard } from "./src/controllers/dashboard.controller.js";
import expressEjsLayouts from "express-ejs-layouts";

const app = express();
const PORT = 3000;
const connectionString = "mongodb://localhost:27017/product-inventory-system";

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("src/public"));

app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.set("layout", "layouts/main");

//routers
app.get("/", getDashboard);
app.use("/products", productRouter);
app.use("/suppliers", supplierRouter);

// Connect to the database
connectDatabase(connectionString);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
