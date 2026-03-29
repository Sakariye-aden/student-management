import { Router } from "express";
import { registerSubject } from "../controllers/subject";

const Route = Router();

Route.post('/', registerSubject)

export default Route;