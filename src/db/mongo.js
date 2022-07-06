import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.URI_CONNECT_MONGO);
let db = null;

client.connect( () => {
    db = client.db(process.env.MONGO_DB_NAME)
});

const objectId = ObjectId;

export {db, client, objectId};