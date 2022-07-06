import express  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "../src/routes/authRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The server is runing on port ${PORT}`))