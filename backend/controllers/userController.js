import validator from 'validator';
import usersModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
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




export {registerUser,logUser,getUserData, updateUser};