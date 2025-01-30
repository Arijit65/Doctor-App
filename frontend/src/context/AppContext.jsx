// import { createContext, useEffect, useState } from "react";
// //import { doctors } from "../assets/assets";
// import axios from 'axios';
// import { toast } from "react-toastify";

// export const AppContext = createContext()


// const AppContextProvider = (props)=>{

//     const backendURL = import.meta.env.VITE_BACKEND_URL ;
//     const [doctors,setDoctors]=useState([]);
//     const currencySymbol='$'
//      const value = {
//         doctors,
//         currencySymbol
//      } 


//     const getAllDoctors = async()=>{
//         
//         try {
//           const {data} = await axios.get( backendURL + '/api/doctors/list')
//             if(data.success){
//                 console.log(data.doctors)
//                 setDoctors(data.doctors)
//             }else{
//                 toast.error(data.message)
//             }
            
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
            
//         }
//     }

//     useEffect(()=>{
//           getAllDoctors()
    
//        },[ ]);


//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

// export default AppContextProvider;


import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const currencySymbol = '$';
    const [token , setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false);
    //console.log(backendURL)
    const [userData,setUserData]=useState(false)
    
    const getAllDoctors = async () => {
        try {
            const  {data}  = await axios.get('http://localhost:4000/api/doctor/list');
            // if (data.success) {
            //     setDoctors(data.doctors);
               
            // } else {
            //     toast.error(data.message);
            // }
            setDoctors(data.doctors);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const loadUserData = async ()=>{
        try {
            const {data} = await axios.get('http://localhost:4000/api/user/get-user',
            {headers:{token}})
            
            if(data.success){
                setUserData(data.user);
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }





    const value = {
        doctors,getAllDoctors,
        currencySymbol,
        backendURL,
        token,
        setToken,
        userData,
        setUserData,
        loadUserData,
    };


    useEffect(() => {
        getAllDoctors()
    }, [] );
    useEffect(()=>{
        if(token){
            loadUserData()
        }else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
