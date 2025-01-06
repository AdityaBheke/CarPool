import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

const authContext = createContext();
export const useAuthContext = ()=>{
    const value = useContext(authContext);
    return value;
}

export function AuthContextProvider({children}){
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState([]);

    const getLoggedInUser = useCallback(()=>{
      const prevUser = localStorage.getItem('user');
      const prevToken = localStorage.getItem('token');
      if (prevUser && prevToken) {
        setUser(JSON.parse(prevUser));
        setToken(prevToken)
        setIsLoggedIn(true);
      }
    },[])
    const signUpUser = async(userDetails)=>{
        console.log("User Data",userDetails);
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
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
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        try {
          const response = await axios.post(`${baseUrl}/users/signin`,{
            ...userCredentials
          });
          const data = response.data;
          console.log(data);
          
          if (data.success) {
            setIsLoggedIn(true);
            setToken(data.token);
            setUser(data.user)
            // PENDING: Store necessary user data in local storage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
          return false;
        }      
    }

    const logoutUser = ()=>{
      setIsLoggedIn(false);
      setToken('');
      setUser(null);
      localStorage.setItem('user', "");
      localStorage.setItem('token', "");
    }

    const handleOnChange = useCallback((e,index)=>{
      const {name, value} = e.target;
      setEmergencyContacts((prevContact)=>
        prevContact.map((contact,i)=>i===index?({...contact,[name]:value}):contact)
      )
    },[])

    const updateEmergencyContacts = useCallback(async()=>{
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.put(`${backendURL}/users/edit`,{
          emergencyContacts: emergencyContacts
        },{
          headers:{
            Authorization:token
          }
        })
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        console.log(error.response?.data || error.message || error);
      }
    },[emergencyContacts, token])
    return (
      <authContext.Provider
        value={{
          isLoggedIn,
          signUpUser,
          signInUser,
          token,
          user,
          logoutUser,
          getLoggedInUser,
          emergencyContacts,
          setEmergencyContacts,
          handleOnChange,
          updateEmergencyContacts
        }}
      >
        {children}
      </authContext.Provider>
    );
}