import { Router } from 'express';
import { enteringResult } from '../controllers/result';


const Route = Router();

Route.post('/', enteringResult)

export default Route