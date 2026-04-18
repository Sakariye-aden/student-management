import { Router } from 'express';
import { getStudentattendance, takingStudentattendance } from '../controllers/studentattendance';
import { takingTeacherattendance } from '../controllers/teacherAttendance';
import { Protect } from '../middleware/protect';


const Route = Router();

// student attendance 
Route.get('/student', Protect, getStudentattendance)
Route.post('/student',Protect,   takingStudentattendance);


// student attendance 
Route.post('/teacher', Protect, takingTeacherattendance)

export default Route