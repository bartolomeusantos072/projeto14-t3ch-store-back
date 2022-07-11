import db from '../db/mongodb.js';
import { ObjectId } from 'mongodb';


export async function getCart(request, response) {

    const { authorization } = request.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return response.status(401).send('Usuário não autorizado!');

    try {

        const session = await db.collection('sessions').findOne({ token });
        if(!session) return response.status(404).send('Sessão não encontrada!');

        const cart = await db.collection('cart').find({ userId: String(session.userId) }).toArray(); 
        
        response.status(200).send(cart);
        
    } catch (error) {

        response.status(500).send(error);
        
    };
};
  
export async function addToCart(request, response) {

    const { productId, userId } = request.body;
    
    try {
        
        const product = await db.collection('products').findOne({ _id: ObjectId(productId) });
        if (!product) return response.sendStatus(404);
        
        const cartProduct = await db.collection('cart').findOne({ productId: productId, userId });
        
        if (cartProduct) {
            await db.collection('cart').updateOne({ productId: productId, userId }, {$inc: {amount: 1}});
        } else {
            await db.collection('cart').insertOne({ ...request.body });
        }
        
        response.status(202).send(cartProduct); 

    } catch (error) {
        
        response.sendStatus(500);  
    };
};

export async function finalizeOrder () {

    const { authorization } = request.headers;
    const token = authorization?.replace('Bearer ', '');
    if(!token) return response.status(401).send('Usuário não autorizado!');

    try {

        const session = await db.collection('sessions').findOne({ token });
        if(!session) return response.status(404).send('Sessão não encontrada!');

        await db.collection('cart').deleteMany({ userId: String(session.userId) }); 
        
        response.status(200).send(cart);
        
    } catch (error) {

        response.status(500).send(error);
        
    };
};