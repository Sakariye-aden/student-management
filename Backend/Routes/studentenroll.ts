import { Router } from "express";
import { studentEnrolled } from "../controllers/studentenrollment";

const Route = Router();

Route.post('/', studentEnrolled)

export default Route;