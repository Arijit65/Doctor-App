import { createContext } from "react";

export const AppContext = createContext();


const AppContextProvider = (props) => {
    
    // const calculateAge = (dob)=>{
    //     const today = new Date()
    //     const birthDate = new Date(dob)
    //     let age = today.getFullYear() - birthDate.getFullYear()
    //     return age
    // }
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
        return age;
    }
    const month = [' ','jan', 'feb', 'mar', 'apr', 'may','jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const slotDateFormat = (slotDate)=>{
      let dateArr = slotDate.split('_')
      return dateArr[0] +' '+month[Number(dateArr[1])]+' '+dateArr[2]
    
    }
    

    const value = {
        calculateAge,
        slotDateFormat,

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;