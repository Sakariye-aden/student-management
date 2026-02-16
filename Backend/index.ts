import express from 'express';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config()

const PORT = process.env.PORT;
const app = express();



app.use(express.json())


app.use(notFound);
app.use(errorHandler)





app.listen(PORT, ()=>{
    console.log(`server is running http://localhost:${PORT}`);
})
