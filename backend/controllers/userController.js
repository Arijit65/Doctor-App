import validator from 'validator';
import usersModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import razorpay from 'razorpay';



const registerUser = async (req, res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({msg:'Please enter all the required fields'});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({msg:'invalid email format'})
        }
        if(password.length < 8 ){
            return res.status(400).json({msg:'password too short'})
        }
        const salt = await bcrypt.genSalt(10) 
        const hashedPassword = await bcrypt.hash(password,salt) 
        const userData = {
            name,
            email,
            password:hashedPassword
        }
        const  user = new usersModel(userData)
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
         res.json({succsess:true,token})
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: error.message });
        
    }
   
}




const logUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await usersModel.findOne({email})
        if(!user){
            return res.status(400).json({msg:'user not found'})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            return res.status(400).json({success:false,message:'Invalid Credentials'})
        }
        
    
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
 
}

const getUserData = async (req,res)=>{
    try {
      const  {user_id}=req.body;
      const user = await usersModel.findById(user_id).select('-password')
     if (!user) { 
        return res.status(404).json({ success: false, message: 'User not found' });
     }
      res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
        
    }
}

const updateUser = async (req,res)=>{
   const {user_id, name, phone, address, dob, gender} = req.body;
   const imageFile = req.file;
   
   if(!name|| !phone || !dob || !gender){
    return res.json({success:false,message:'Data is missing'})
   }
   await usersModel.findByIdAndUpdate(user_id,{name,phone,address:JSON.parse(address),dob,gender})

   if(imageFile){

    const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
    const imageUrl = imageUpload.secure_url;
    await usersModel.findByIdAndUpdate(user_id,{image:imageUrl});

   }
   res.json({success:true,message:'Profile Updated'})
   
}


const bookAppointment = async (req,res) => {

    try {
        const {user_id, docId, slotDate, slotTime} = req.body;
      const docData = await doctorModel.findById(docId).select('-password');
      if(!docData.available){
        return res.json({success:false,message:'Doctor not available'})
      } 
      let slots_booked = docData.slots_booked;

      // checking for slots available
      if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:'Slots not available'})
        }else{
            slots_booked[slotDate].push(slotTime);
        }
      }else {
        slots_booked[slotDate]=[]
        slots_booked[slotDate].push(slotTime);
      }
      const userData = await usersModel.findById(user_id).select('-password')
      const appointmentData = {
        user_id,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now()
      }
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
      await doctorModel.findByIdAndUpdate(docData,{slots_booked})

      res.json({success:true, message:'Appointment booked'});



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
      
}

// API to get user appointments for frontend my-appointments page 

const listAppointment = async(req,res)=>{
    try {
        const {user_id}=req.body;
        const appointments = await appointmentModel.find({user_id})

        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

const cancelAppointment = async(req,res)=>{
    try {
        const {user_id,appointmentId}=req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        //varify appointment user 
            if(appointmentData.user_id !== user_id) {
                return res.json({success:false,message:'unauthorized action'})
            }
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

            //releasing doctor slot

            const {docId, slotDate,slotTime}=appointmentData
            const doctorData = await doctorModel.findById(docId)
            let slots_booked = doctorData.slots_booked

            slots_booked[slotDate]=slots_booked[slotDate].filter(e=> e !== slotTime)

            await doctorModel.findByIdAndUpdate(docId,{slots_booked})
            res.json({success:true, message:'Appointment Cancelled'})

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
        
    }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET
})

// Api to create payament gateway for appointments using razorpay

const paymentRazorpay = async(req,res)=>{
    try {

        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(!appointmentId || appointmentData.cancelled ){
            return res.json({success:false,message:"Appointment canceeld or not found"})
        }

        // creating razorpay payment options
        const options={
            amount:appointmentData.amount*100,
            currency: 'INR',
            receipt: appointmentId,
        }

        // creating razorpay payment
        const order = await razorpayInstance.orders.create(options);
        res.json({success:true,order})

        
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}


// Api to verify payment of razorpay

const verifyRazorpay = async (req,res)=>{
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"payment successful"})
        }else{
            res.json({success:false,message:"payment failed"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
        
    }
}


export {registerUser,logUser,getUserData, updateUser, bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay};