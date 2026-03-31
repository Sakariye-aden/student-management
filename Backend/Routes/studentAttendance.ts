import { Router } from 'express';
import { takingStudentattendance } from '../controllers/studentattendance';


const Route = Router();

Route.post('/', takingStudentattendance)

export default Route