import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/users';

const Route = Router();

Route.post('/register', registerUser);
Route.post('/login',loginUser)

export default Route