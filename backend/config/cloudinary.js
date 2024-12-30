import {v2 as cloudinary} from 'cloudinary';
 const connectCloudinary = async ()=>{

    cloudinary.config({
        cloud_name: 'dlwrb962v',
        api_key: '636774173748712',
        api_secret: 'WklEQ7NyIT2BGH8SPF0ZJWoP_D8',
    })


 }

 export default connectCloudinary;