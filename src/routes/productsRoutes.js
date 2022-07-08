import { Router } from "express";
import { getProducts, registerProducts, showProduct } from "../controllers/productsControllers.js";

const productsRoutes = Router();

productsRoutes.get('/products', getProducts);
productsRoutes.get('/products/:id', showProduct);
productsRoutes.post('/products', registerProducts);

export default productsRoutes;