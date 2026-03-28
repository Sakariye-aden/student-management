import { Router } from 'express';
import { deleteTeacher, getAllteachers, getoneTeacher, registerTeacher, updateTeacher } from '../controllers/teacher';


const Route = Router();


Route.get('/:id', getoneTeacher);
Route.get('/', getAllteachers);
Route.post('/', registerTeacher);
Route.put('/:id', updateTeacher);
Route.delete('/:id', deleteTeacher)

export default Route