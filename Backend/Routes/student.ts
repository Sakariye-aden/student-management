import { Router } from 'express';
import { deleteStudentinfo, getAllStudents, getoneStudentinfo, registerStudent, updateStudentinfo } from '../controllers/student';

const Route = Router();

Route.get('/:id', getoneStudentinfo);
Route.get('/', getAllStudents);
Route.post('/', registerStudent);
Route.put('/:id', updateStudentinfo)
Route.delete('/:id', deleteStudentinfo)


export default Route