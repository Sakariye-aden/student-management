import { Router } from "express";
import { deleteSubject, getSubjects, registerSubject, updateSubject } from "../controllers/subject";
import { Protect } from "../middleware/protect";

const Route = Router();


Route.get('/', Protect , getSubjects);
Route.post('/', Protect, registerSubject);
Route.put('/:id', Protect , updateSubject);
Route.delete('/:id', Protect, deleteSubject);


export default Route;