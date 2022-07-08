import  { db, mongoClient, objectId } from '../db/mongodb.js';;

export async function getProducts(request, response) {
    try {
        mongoClient.connect();
        const products = await db.collection('products').find().toArray();
        response.status(200).send(products);
        await mongoClient.close();
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    };
};

export async function registerProducts(request, response) {
    
    const products = request.body;
    
    try {

         mongoClient.connect();

        await db.collection('products').insertMany(products);
        
        await mongoClient.close();
        response.sendStatus(201);
        
    } catch (error) {
        console.log(error)
        await mongoClient.close();
        response.sendStatus(500);
    }
};

export async function showProduct(request, response) {

    const { id } = request.params;

    try {
        
        mongoClient.connect();

        const product = await db.collection('products').findOne({ _id: objectId(id) });
        if (!product) return response.sendStatus(404);

        await mongoClient.close();
        response.status(202).send(product);

    } catch (error) {

        await mongoClient.close();
        response.sendStatus(500);
    }
};