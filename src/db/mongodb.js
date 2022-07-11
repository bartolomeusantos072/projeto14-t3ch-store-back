import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;

const client = new MongoClient(process.env.MONGO_URL);

try {
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  console.log('Banco de dados conectado com sucesso...');
} catch (error) {
  console.error('Aconteceu um problema ao conectar o banco de dados...');
}

const objectId = ObjectId;

export  {db, client, objectId};  