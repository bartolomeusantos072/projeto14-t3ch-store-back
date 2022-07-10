import { Router } from "express";
import { getCart,addToCart } from "../controllers/cartController.js";

const productsRoutes = Router();


productsRoutes.get('/cart', getCart);
productsRoutes.post('/cart', addToCart);

export default productsRoutes;