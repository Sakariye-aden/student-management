import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler';
import userRoute from './Routes/users';
import AdminRoute from './Routes/admin';
import studentRoute from './Routes/student';
import teacherRoute from './Routes/teacher';
import subjectRoute from './Routes/subject';
import planRoute from './Routes/teacherPlan';
import stdenrollRoute from './Routes/studentenroll';
import tchenrollRoute from './Routes/teacherenrollment';
import resultRoute from './Routes/result';

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
// subject 
app.use('/subject', subjectRoute);
// plan 
app.use('/plan', planRoute)
// student enrollment 
app.use('/studentenrollment', stdenrollRoute);
// teacher enrollment 
app.use('/teacherenrollment', tchenrollRoute)

// result 
app.use('/result', resultRoute)




app.use(notFound);
app.use(errorHandler)



mongoose.connect(mongo)
   .then(()=> console.log('✅successfully connected'))
   .catch((err)=>console.log('❌ dissconnected',err))

app.listen(PORT, ()=>{
    console.log(`server is running http://localhost:${PORT}`);
})
