import { Router } from "express";
import { creatUser , loginUser} from "../controllers/authController.js"
 
const  userRouter = Router()


userRouter.post("/sign-up" , creatUser)
userRouter.post("/sign-in" , loginUser)


export default userRouter;