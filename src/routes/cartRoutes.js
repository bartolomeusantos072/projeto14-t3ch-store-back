import { Router } from "express";

import {
  getCart,
  postProductToCart,
  putQuantityOfCart,
  deleteProductFromCart,
} from "../controllers/cartController.js";

import {
  getCartValidation,
  postAndPutProductToCartValidation,
  deleteProductFromCartValidation,
} from "../schemas/cartSchema.js";

import  {validateToken}  from "../middleware/tokenValidation.js";

const cartRouter = Router();
cartRouter.use(validateToken);
cartRouter.get("/cart", getCartValidation, getCart);
cartRouter.post("/cart", postAndPutProductToCartValidation, postProductToCart);
cartRouter.put("/cart", postAndPutProductToCartValidation, putQuantityOfCart);
cartRouter.delete(
  "/cart/:productId",
  deleteProductFromCartValidation,
  deleteProductFromCart
);

export default cartRouter;
