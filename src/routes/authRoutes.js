import { Router } from "express";
import { creatUser , loginUser} from "../controllers/authController.js";
 
const  router = Router();


router.post("/sign-up" , creatUser);
router.post("/sign-in" , loginUser);


export default router;