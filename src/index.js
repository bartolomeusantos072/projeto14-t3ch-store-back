import express  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './routes/productsRoutes.js';
import authRoutes from "../src/routes/authRoutes.js";
import cartRoutes from "../src/routes/cartRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(productsRoutes);
app.use(authRoutes);
app.use(cartRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The server is runing on port ${PORT}`));