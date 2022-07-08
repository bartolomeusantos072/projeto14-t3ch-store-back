import { Router } from "express"

import userRouter from "./authRoutes.js"
import cartRouter from "./cartRoutes.js"
import checkoutRouter from "./checkoutRoutes.js"

const router = Router()

router.use(userRouter)
router.use(cartRouter)
router.use(checkoutRouter)

export default router
