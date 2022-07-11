import { Router } from "express";
import { getCart, addToCart, finalizeOrder } from "../controllers/cartController.js";

const productsRoutes = Router();


productsRoutes.get('/cart', getCart);
productsRoutes.post('/cart', addToCart);
productsRoutes.delete('/cart', finalizeOrder)

export default productsRoutes;