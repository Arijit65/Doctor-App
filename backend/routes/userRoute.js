import express from 'express';
import { bookAppointment, cancelAppointment, getUserData, listAppointment, logUser, paymentRazorpay, registerUser, updateUser, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', logUser)

userRouter.get('/get-user',authUser,getUserData)
userRouter.post('/update',upload.single('image'),authUser,updateUser)
userRouter.post('/book-appointment',authUser,bookAppointment);
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verify-razorpay',authUser,verifyRazorpay)

export default userRouter;
