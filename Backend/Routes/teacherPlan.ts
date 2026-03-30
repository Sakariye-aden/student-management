import { Router } from "express";
import { registerPlan } from "../controllers/teacherPlan";

const Route = Router();

Route.post('/', registerPlan)

export default Route;