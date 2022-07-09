import { Router } from "express";
import { getProducts, registerProducts, showProduct, addToCart } from "../controllers/productsControllers.js";

const productsRoutes = Router();

productsRoutes.get('/products', getProducts);
productsRoutes.get('/products/:id', showProduct);
productsRoutes.post('/products', registerProducts);
productsRoutes.post('/cart', addToCart);

export default productsRoutes;