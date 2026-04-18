import { Router } from "express";
import { getPlanbyLimit, registerPlan } from "../controllers/teacherPlan";
import { Protect } from "../middleware/protect";

const Route = Router();

Route.get('/', Protect, getPlanbyLimit )

Route.post('/', Protect, registerPlan);

export default Route;