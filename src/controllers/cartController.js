import { db } from "../db/mongo.js"
import { objectId } from "../db/mongo.js";


export async function getCart(request, response) {

    
	const {userId}= request.body;

    try {
       
        const cart = await db.collection('cart').find({userId}).toArray();
        response.status(200).send(cart);
        console.log(cart);
    } catch (error) {

        response.status(500).send(error);
        
    };
};
  
export async function addToCart(request, response) {

    const { productId, userId } = request.body;

    try {
        
        const product = await db.collection('products').findOne({ _id: objectId(productId) });
        if (!product) return response.sendStatus(404);
        
        const cartProduct = await db.collection('cart').findOne({ productId: productId, userId });
        
        
        if (cartProduct) {
            
            await db.collection('cart').updateOne({ productId: productId, userId }, {$inc: {amount: 1}})
        } else {
            await db.collection('cart').insertOne({ ...request.body });
        }
        
        response.status(202).send(cartProduct); 

    } catch (error) {
        
        response.sendStatus(500);  
    };
};

