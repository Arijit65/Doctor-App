// import React, { useEffect } from 'react'
// import { useContext } from 'react'
// import { AdminContext } from '../../context/AdminContext'
// import axios from 'axios'

// const DoctorsList = () => {

//   const backendUrl =  import.meta.env.VITE_BACKEND_URL;
//   const {doctors,aToken,getAllDoctors}=useContext(AdminContext);
//   const changeAvailability = async (docID) => { try 
//     { console.log('Sending docID:', docID);
//      // Log docID to ensure it's being passed correctly 
//      const { data } = await axios.post( backendUrl + '/api/admin/change-availability', 
//       { docID }, 
//       { headers: { aToken } } ); 
//       console.log('API Response:', data); 
//   } catch (error) {
//     console.error('Error:', error);
    
//   }
//   }
//    useEffect(()=>{
//     if(aToken){
//       getAllDoctors()
//     }

//    },[aToken]);



//   return (
//     <div className='m-5 max-h-[90vh] overflow-y-scroll ' >
//       <h1 className='text-lg font-medium'>All Doctors</h1>
//       <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
//         {
//           doctors.map((item,index)=>(
//             <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
//               <img className='bg-indigo-50 group-hover:bg-primary transition-alll duration-500' src={item.image} alt="" />
//               <div className='p-4'>
//                 <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
//                 <p className='text-zinc-600 text-sm'>{item.speciality}</p>
//                 <div className='mt-2 flex items-center gap-1 text-sm'>
//                   <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked = {item.available} /> 
                  
//                   <p>Available {item._id} </p>
//                 </div>
//               </div>
//             </div>
//           ))
//         }
//       </div>
      
//     </div>
//   )
// }


// export default DoctorsList;

import React, { useEffect } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import {toast} from 'react-toastify';
const DoctorsList = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { doctors, aToken, getAllDoctors } = useContext(AdminContext);

  const changeAvailability = async (docID) => {
    try {
      console.log('Sending docID:', docID); // Log docID to ensure it's being passed correctly
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        {
          "docId": docID,
        }
        ,
        { 'Content-Type': 'application/json',
           headers: { aToken } }
      );
      console.log('API Response:', data);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      toast.error('Failed to change availability.');
    }
  };

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt='' />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available {item._id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
