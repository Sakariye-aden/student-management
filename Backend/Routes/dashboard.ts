import { Router } from "express";
import { Protect } from "../middleware/protect";
import { getAllCounts, getRecentActivities } from "../controllers/dashboard";

const Route = Router();


Route.get('/', Protect, getAllCounts)
Route.get('/recent', Protect, getRecentActivities)

export default Route ; 