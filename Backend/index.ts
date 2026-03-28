import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler';
import userRoute from './Routes/users';
import AdminRoute from './Routes/admin';
import studentRoute from './Routes/student';
import teacherRoute from './Routes/teacher';

dotenv.config()

const PORT = process.env.PORT;
const mongo = process.env.MONGODB_DEV as string
const app = express();


app.use(express.json())
app.use('/Auth',userRoute)
app.use('/Auth',userRoute)
app.use('/admin', AdminRoute)

// student 
app.use('/student', studentRoute)
// teacher 
app.use('/teacher', teacherRoute)

app.use(notFound);
app.use(errorHandler)



mongoose.connect(mongo)
   .then(()=> console.log('✅successfully connected'))
   .catch((err)=>console.log('❌ dissconnected',err))

app.listen(PORT, ()=>{
    console.log(`server is running http://localhost:${PORT}`);
})
