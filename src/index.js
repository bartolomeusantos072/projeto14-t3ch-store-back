import express  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "../src/routes/authRoutes.js";
import productsRoutes from './routes/productsRoutes.js';
import cartRouter from "./routes/cartRouter.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use(authRoutes);
app.use(productsRoutes);
app.use(cartRouter);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`The server is runing on port ${PORT}`));