import { Router } from 'express';
import { AllUsers, getMe, loginUser, logoutUser, registerUser } from '../controllers/users';
import { Protect } from '../middleware/protect';

const Route = Router();

Route.get('/me', Protect, getMe);
Route.get('/all', Protect, AllUsers);
Route.post('/register', registerUser);
Route.post('/login',loginUser)
Route.post('/logout', logoutUser)

export default Route