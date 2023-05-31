import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { connectDB } from './DB/connection.js';
import * as indexRouter from './modules/index.router.js'
import { InitServer } from './admin/admin.js';

const app = express();

app.use(express.json());
app.use(`${process.env.baseURL}/auth`, indexRouter.authRouter);
app.use(`${process.env.baseURL}/user`, indexRouter.userRouter);
app.use(`${process.env.baseURL}/product`, indexRouter.productRouter);
app.use(`${process.env.baseURL}/comment`, indexRouter.commentRouter);

connectDB();
InitServer();

app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
})