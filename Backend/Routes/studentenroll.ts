import { Router } from "express";
import { deleteStudentEnroll, readStudentsubject, studentEnrolled, updateStudentEnroll } from "../controllers/studentenrollment";
import { Protect } from "../middleware/protect";

const Route = Router();

Route.get('/', Protect, readStudentsubject)
Route.post('/', Protect, studentEnrolled);
Route.put('/:id', Protect, updateStudentEnroll);
Route.delete('/:id', Protect, deleteStudentEnroll)

export default Route;