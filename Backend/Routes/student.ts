import { Router } from 'express';
import { deleteStudentinfo, getAllStudents, getoneStudentinfo, getStudentPerLimit, getStudentsGrade, registerStudent, updateStudentinfo } from '../controllers/student';
import { Protect } from '../middleware/protect';
import { authorizeRole } from '../middleware/rolemiddleware';
import { getStudentRolebyLimit } from '../controllers/users';

const Route = Router();

//get student by query 
Route.get('/user' , Protect, getStudentsGrade);
// get student s per limit // 10 then 20 
Route.get('/', Protect , getStudentPerLimit);

// get user whos role is student 
Route.get('/Auth', Protect , getStudentRolebyLimit)
// get all students 
Route.get('/', Protect , getAllStudents);
Route.get('/:id', Protect, getoneStudentinfo);
Route.post('/', Protect, authorizeRole("vice principle","principle"), registerStudent);
Route.put('/:id',Protect, updateStudentinfo)
Route.delete('/:id',Protect, deleteStudentinfo)


export default Route