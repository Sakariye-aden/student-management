import { Router } from 'express';
import { updateUserRole } from '../controllers/admin';


const Route = Router();

Route.put('/:id', updateUserRole)

export default Route