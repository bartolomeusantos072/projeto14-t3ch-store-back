import { db, client, objectId } from '../db/mongo.js';

export async function getProducts(request, response) {

    try {
        client.connect();
        const products = await db.collection('products').find().toArray();
        response.status(200).send(products);
        await client.close();
    } catch (error) {
        response.status(500).send(error);
    };
};

export async function registerProducts(request, response) {
    
    const products = request.body;
    
    try {

        client.connect();

        await db.collection('products').insertMany(products);
        
        await client.close();
        response.sendStatus(201);
        
    } catch (error) {

        await client.close();
        response.sendStatus(500);
    }
};

export async function showProduct(request, response) {

    const { id } = request.params;

    try {
        
        client.connect();

        const product = await db.collection('products').findOne({ _id: objectId(id) });
        if (!product) return response.sendStatus(404);

        await client.close();
        response.status(202).send(product);

    } catch (error) {

        await client.close();
        response.sendStatus(500);
    }
};