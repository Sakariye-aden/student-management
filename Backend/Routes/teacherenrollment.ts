import { Router } from "express";
import { deleteTeacherEnroll, readTeachersubject, teacherEnrolled, updateTeacherEnroll } from "../controllers/teacherEnrollment";
import { Protect } from "../middleware/protect";

const Route = Router();

Route.get('/', Protect , readTeachersubject)
Route.post('/',Protect, teacherEnrolled);
Route.put('/:id', Protect, updateTeacherEnroll);
Route.delete('/:id', Protect, deleteTeacherEnroll)

export default Route;