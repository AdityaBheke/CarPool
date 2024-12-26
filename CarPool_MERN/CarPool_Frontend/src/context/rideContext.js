import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./authContext";

const rideContext = createContext();

export const useRideContext = ()=>{
    const value = useContext(rideContext);
    return value;
}

export function RideContextProvider({children}){
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const {token} = useAuthContext();
    const [rides, setRides] = useState([]);
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        journeyDate: setDate(),
        reqSeats: 1,
      });
    const [publishData, setPublishData] = useState({
        origin:"",
        originId:"",
        destination:"",
        destinationId:"",
        journeyDate: setDate(),
        startTime:"",
        totalSeats: 1,
        farePerPerson: "",
        vehicleName:"",
        vehicleColor:"",
        vehiclePlate:""
    })


    // Set default date
    function setDate(){
        const [month, day, year] = new Date().toLocaleDateString().split("/");
        return `${year}-${month}-${day}`;
    }
    // Search and fetch Rides from backend
    const searchRides = async (criteria)=>{
        try {
            const response = await axios.get(`${backendUrl}/ride/filter`, {
                params: criteria,
                headers: {
                    Authorization: token, 
                }
            });
            const data = response.data;
            if (data.success) {
              setRides(data.rides);
            }
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
    }
    // Publish ride
    const publishRide = async (rideData)=>{
        try {
            console.log(rideData);
            const response = await axios.post(`${backendUrl}/ride`, rideData,{
                headers:{
                    Authorization: token
                }
            });
            const data = response.data;
            console.log(data);
            
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
    }

    const resetPublishData = ()=>{
        setPublishData({
            origin:"",
            destination:"",
            journeyDate: setDate(),
            startTime:"",
            totalSeats: 1,
            farePerPerson: "",
            vehicleName:"",
            vehicleColor:"",
            vehiclePlate:""
        });
    }

    const fetchRideHistory= async()=>{
        try {
            const response = await axios.get(`${backendUrl}/ride`,{
                headers:{
                    Authorization: token
                }
            });
            const data = response.data;
            if (data.success) {
                setRides(data.rides);
            }
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
    }

    return (
      <rideContext.Provider
        value={{
          rides,
          searchRides,
          searchData,
          setSearchData,
          setDate,
          publishData,
          publishRide,
          setPublishData,
          resetPublishData,
          fetchRideHistory,
          setRides
        }}
      >
        {children}
      </rideContext.Provider>
    );
}