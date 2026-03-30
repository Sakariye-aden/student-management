import { Router } from "express";
import { teacherEnrolled } from "../controllers/teacherEnrollment";

const Route = Router();

Route.post('/', teacherEnrolled)

export default Route;