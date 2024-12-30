import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'

//API for calling doctor

const addDoctor = async (req, res) => {


    try {
        const {name,email,password,speciality,degree,about,experience,fees,address}=req.body;
        const imageFile = req.file;
        // checking for all data to add doctor


        if (!name ||!email ||!password ||!speciality ||!degree ||!about ||!experience ||!fees ||!address) {
            return res.status(400).json({ msg: 'Please enter all the required fields' });
        }

        // validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email format' });
        }
        // validate password length
        if (password.length <8){
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }


        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            about,
            experience,
            fees,
            address: JSON.parse(address),
            date:Date.now()

        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added"}) 


        
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for admin login

const loginAdmin = async (req,res)=>{

    try {

        const {email,password}=  req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})



        } else{

            res.json({success:false,message:'invalid email or password'})
        }


        
    } catch (error) {

        
        console.log(error)
        res.json({success:false,message:error.message})

        
    }

}



// api for getting docctors data

const allDoctors = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}


export {addDoctor, loginAdmin, allDoctors}