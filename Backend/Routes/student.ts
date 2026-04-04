import { Router } from 'express';
import { deleteStudentinfo, getAllStudents, getoneStudentinfo, registerStudent, updateStudentinfo } from '../controllers/student';
import { Protect } from '../middleware/protect';
import { authorizeRole } from '../middleware/rolemiddleware';

const Route = Router();

Route.get('/:id', Protect, getoneStudentinfo);
Route.get('/', Protect , getAllStudents);
Route.post('/', Protect, authorizeRole("vice principle","principle"), registerStudent);
Route.put('/:id',Protect, updateStudentinfo)
Route.delete('/:id',Protect, deleteStudentinfo)


export default Route