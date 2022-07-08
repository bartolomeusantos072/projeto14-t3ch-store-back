import { Router } from "express"

import {
  getCheckouts,
  getCheckoutByCheckoutId,
  postCheckoutByProductId,
  postCheckout,
  deleteCheckoutByCheckoutId,
} from "../controllers/checkoutController.js"

import {validateToken}  from "../middlaware/tokenValidation.js"
import  {checkoutValidation} from "../middlaware/checkoutValidation.js"

const checkoutRouter = Router()

checkoutRouter.use(validateToken)
checkoutRouter.get("/checkout", getCheckouts)
checkoutRouter.get(
  "/checkout/:checkoutId",
  checkoutValidation,
  getCheckoutByCheckoutId,
)
checkoutRouter.post(
  "/checkout/:productId",
  checkoutValidation,
  postCheckoutByProductId,
)
checkoutRouter.post("/checkout", checkoutValidation, postCheckout)
checkoutRouter.delete("/checkout/:checkoutId", deleteCheckoutByCheckoutId)

export default checkoutRouter