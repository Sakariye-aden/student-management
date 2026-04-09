import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler, notFound } from './middleware/errorHandler';
import cookieParser from "cookie-parser";
import cors from 'cors'
// routes 
import userRoute from './Routes/users';
import AdminRoute from './Routes/admin';
import studentRoute from './Routes/student';
import teacherRoute from './Routes/teacher';
import subjectRoute from './Routes/subject';
import planRoute from './Routes/teacherPlan';
import stdenrollRoute from './Routes/studentenroll';
import tchenrollRoute from './Routes/teacherenrollment';
import resultRoute from './Routes/result';
import AttendanceRoute from './Routes/Attendance';
import DashboardRoute from './Routes/dashboard';

dotenv.config()

const PORT = process.env.PORT;
const mongo = process.env.MONGODB_DEV as string
const app = express();


app.use(express.json())
app.use(cookieParser());

app.use(cors(
       {
        origin:['http://localhost:5173'],
        credentials: true,       
       }
    ))

app.use('/api/Auth',userRoute)
app.use('/api/Auth',userRoute)
app.use('/admin', AdminRoute)
app.use('/api/dashboard', DashboardRoute)
// student 
app.use('/api/student', studentRoute)
// teacher 
app.use('/api/teacher', teacherRoute)
// subject 
app.use('/api/subject', subjectRoute);
// plan 
app.use('/api/plan', planRoute)
// student enrollment 
app.use('/api/studentenrollment', stdenrollRoute);
// teacher enrollment 
app.use('/api/teacherenrollment', tchenrollRoute)

// result 
app.use('/api/result', resultRoute);

// student attendance 
app.use('/api/attendance', AttendanceRoute);


app.use(notFound);
app.use(errorHandler)



mongoose.connect(mongo)
   .then(()=> console.log('✅successfully connected'))
   .catch((err)=>console.log('❌ dissconnected',err))

app.listen(PORT, ()=>{
    console.log(`server is running http://localhost:${PORT}`);
})
