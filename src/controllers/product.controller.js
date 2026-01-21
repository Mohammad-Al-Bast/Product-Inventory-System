import productModel from '../models/product.model.js';

const getAllProducts = async (req, res) => {
    try{
        const products = await productModel.find();
        res.render("products", {products});
    }catch{
        res.status(500).send("Error retrieving products");
    }
}

export { getAllProducts };