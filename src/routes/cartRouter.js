import {Router} from "express";
import { getCart, getOwnedCards, postBuyCards, postProductToCart } from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/cartpost",postProductToCart);
cartRouter.post("/cartbuy",postBuyCards);
cartRouter.get("cart-get",getCart);
cartRouter.get("cartowned",getOwnedCards);

export  default cartRouter;
//adicionar isso depois removo o comentario