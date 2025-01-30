import jwt from 'jsonwebtoken'

// admin authentication middleware 

const authUser = async (req, res, next) => {
    
    try {

        const {token}=req.headers
        if(!token){
            return res.json({success:false,message:'Token not provided'})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET) 
        
       
        req.body.user_id = token_decode.id ;

        
        next()


        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

export default authUser;

 // if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        //     return res.json({success:false,message:'Authentication failed'})}


// import jwt from 'jsonwebtoken';

// // Admin authentication middleware 
// const authUser = async (req, res, next) => {
//     try {
//         const token = req.headers;
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Token not provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.body.user_id = decoded.id;

//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// export default authUser;
