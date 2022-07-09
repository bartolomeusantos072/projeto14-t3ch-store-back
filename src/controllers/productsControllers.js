import db from '../db/mongodb.js';
import { ObjectId } from 'mongodb';

export async function getProducts(request, response) {

    try {
        
        const products = await db.collection('products').find().toArray();
        response.status(200).send(products);
        
    } catch (error) {

        response.status(500).send(error);
        
    };
};
  
export async function registerProducts(request, response) {
    
    const products = request.body;
    
    try {

        await db.collection('products').insertMany(products); 
        
        response.sendStatus(201);
        
    } catch (error) {

        response.sendStatus(500); 
         
    };
};

export async function showProduct(request, response) {

    const { id } = request.params;

    try {
        
        const product = await db.collection('products').findOne({ _id: ObjectId(id) });
        if (!product) return response.sendStatus(404);
        
        response.status(202).send(product); 

    } catch (error) {

        response.sendStatus(500);
    }
};

export async function addToCart(request, response) {

    const { productId, userId } = request.body;
    
    try {
        
        const product = await db.collection('products').findOne({ _id: ObjectId(productId) });
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