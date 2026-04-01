import { Router } from 'express';
import { takingStudentattendance } from '../controllers/studentattendance';


const Route = Router();

Route.post('/student', takingStudentattendance);
Route.post('/teacher', takingTeacherattendance)

export default Route