import { Router } from "express";
import { Protect } from "../middleware/protect";
import { getAllCounts } from "../controllers/dashboard";

const Route = Router();


Route.get('/', Protect, getAllCounts)


export default Route ; 