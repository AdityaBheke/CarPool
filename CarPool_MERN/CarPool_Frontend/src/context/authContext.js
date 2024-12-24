import axios from "axios";
import { createContext, useContext, useState } from "react";

const authContext = createContext();
export const useAuthContext = ()=>{
    const value = useContext(authContext);
    return value;
}

export function AuthContextProvider({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    // const getLoggedInUser = ()=>{

    // }
    const signUpUser = async(userDetails)=>{
        console.log("User Data",userDetails);
        try {
          const response = await axios.post(`${baseUrl}/users/signup`,{
            ...userDetails
          });
          const data = response.data;
          console.log(data);
          if (data.success) {
            return true
          }else{
            return false
          }
          
        } catch (error) {
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
          return false
        }
    }
    const signInUser = async(userCredentials)=>{
        console.log("User Credentials",userCredentials);
        try {
          const response = await axios.post(`${baseUrl}/users/signin`,{
            ...userCredentials
          });
          const data = response.data;
          console.log(data);
          
          if (data.success) {
            setIsLoggedIn(true);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
          return false;
        }      
    }
    return (
      <authContext.Provider
        value={{
          isLoggedIn,
          signUpUser,
          signInUser,
        }}
      >
        {children}
      </authContext.Provider>
    );
}