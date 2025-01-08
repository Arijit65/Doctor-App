import express from 'express';
import { getUserData, logUser, registerUser, updateUser } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', logUser)
userRouter.get('/get-user',authUser,getUserData)
userRouter.post('/update',upload.single('image'),authUser,updateUser)
export default userRouter;
