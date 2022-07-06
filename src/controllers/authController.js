
import db from "../db/mongo.js"
import bcrypt from "bcrypt"
import authRegisterSchema from "../schemas/authSchema.js"


console.log("oi")
export async function creatUser(req,res){
    console.log("oi")
    const  { username , email , password , confirmPassword } = req.body
    

    const { error } = authRegisterSchema.validate({username , email , password , confirmPassword})

    if(error){
        return res.status(422).send("email ou senha estão incorretos")
    }
try{
    const verifyEmail = await db.collection("users").findOne({email})
    if(verifyEmail){
        return res.status(400).send("email inválido")
    }
    const misticPassword = bcrypt.hashSync(password , 10)

   await db.collection("users").insertOne({username , email , password:misticPassword })

   return res.send("foi")

}catch(e){
    console.log(e)
}
}

