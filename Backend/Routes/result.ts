import { Router } from 'express';
import { calculateResult, enteringResult } from '../controllers/result';
import { Protect } from '../middleware/protect';


const Route = Router();

Route.get('/', Protect , calculateResult)
Route.post('/',Protect,  enteringResult)

export default Route