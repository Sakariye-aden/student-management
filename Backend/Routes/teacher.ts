import { Router } from 'express';
import { deleteTeacher, getAllteachers, getoneTeacher, getTeacherPerLimit, registerTeacher, updateTeacher } from '../controllers/teacher';
import { Protect } from '../middleware/protect';
import { getTeacherRolebyLimit } from '../controllers/users';


const Route = Router();

// get teacher in pagination
Route.get('/All', Protect, getTeacherPerLimit);
// get users whos role is teacher in pgn
Route.get('/Auth', Protect , getTeacherRolebyLimit)
Route.get('/:id', getoneTeacher);
Route.get('/', getAllteachers);
Route.post('/', registerTeacher);
Route.put('/:id', updateTeacher);
Route.delete('/:id', deleteTeacher)

export default Route