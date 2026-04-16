import { Router } from "express";
import { deleteStudentEnroll, getStudentsBySubject, readStudentsubject, studentEnrolled, updateStudentEnroll } from "../controllers/studentenrollment";
import { Protect } from "../middleware/protect";

const Route = Router();

// get and read student ans subjects for both 
Route.get('/', Protect, readStudentsubject);
// get students that enrolled the subject 
Route.get('/student', Protect , getStudentsBySubject)

Route.post('/', Protect, studentEnrolled);
Route.put('/:id', Protect, updateStudentEnroll);
Route.delete('/:id', Protect, deleteStudentEnroll)

export default Route;