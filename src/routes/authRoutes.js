import { Router } from "express";
import { creatUser} from "../controllers/authController.js"
 
const  router = Router()


router.post("/sing-up" , creatUser)


export default router;