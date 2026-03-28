import { Router } from 'express';
import { getAllStudents, getoneStudentinfo, registerStudent } from '../controllers/student';

const Route = Router();

Route.get('/:id', getoneStudentinfo);
Route.get('/', getAllStudents);
Route.post('/', registerStudent);



export default Route