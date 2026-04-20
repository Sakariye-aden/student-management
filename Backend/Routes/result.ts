import { Router } from 'express';
import { calculateResult, enteringResult, oneStudentResult } from '../controllers/result';
import { Protect } from '../middleware/protect';


const Route = Router();

Route.get('/', Protect , calculateResult);
Route.get('/student', Protect , oneStudentResult)
Route.post('/',Protect,  enteringResult)

export default Route