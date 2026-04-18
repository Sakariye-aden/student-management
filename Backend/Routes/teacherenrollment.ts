import { Router } from "express";
import { deleteTeacherEnroll, getTeacherenroll, getteacherhisStudent, readTeachersubject, teacherEnrolled, updateTeacherEnroll } from "../controllers/teacherEnrollment";
import { Protect } from "../middleware/protect";

const Route = Router();

// get all teacher read his subject 
Route.get('/', Protect , readTeachersubject);

// get teacher and his enrolled subject
Route.get('/:id', Protect, getTeacherenroll);
// get how many students in his subject teacher teaches 
Route.get('/student/:id', Protect, getteacherhisStudent);

Route.post('/',Protect, teacherEnrolled);
Route.put('/:id', Protect, updateTeacherEnroll);
Route.delete('/:id', Protect, deleteTeacherEnroll)

export default Route;