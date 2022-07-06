import { Router } from "express";
import { creatUser , loginUser} from "../controllers/authController.js"
 
const  router = Router()


router.post("/sing-up" , creatUser)
router.post("/sing-in" , loginUser)


export default router;