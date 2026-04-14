import { Router } from 'express';
import { AllUsers, deleteUser, getLimitUser, getMe, loginUser, logoutUser, registerUser } from '../controllers/users';
import { Protect } from '../middleware/protect';

const Route = Router();


// get users for limit 
Route.get('/users',Protect , getLimitUser )

// get user info 
Route.get('/me', Protect, getMe);
// get all users 
Route.get('/all', Protect, AllUsers);
Route.post('/register', registerUser);
Route.post('/login',loginUser)
Route.post('/logout', logoutUser);
Route.delete('/user/:id', Protect , deleteUser)

export default Route