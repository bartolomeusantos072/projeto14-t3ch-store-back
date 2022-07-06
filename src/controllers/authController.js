
import db from "../db/mongo.js"
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

   await db.collection("users").insertOne({username , email , password , confirmPassword})

   return res.send("foi")

}catch(e){
    console.log(e)
}
}

