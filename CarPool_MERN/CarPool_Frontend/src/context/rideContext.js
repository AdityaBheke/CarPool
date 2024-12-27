import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuthContext } from "./authContext";

const rideContext = createContext();

export const useRideContext = ()=>{
    const value = useContext(rideContext);
    return value;
}

export function RideContextProvider({children}){
    // const backendUrls = process.env.REACT_APP_BACKEND_URL;
    const {token} = useAuthContext();
    const [rides, setRides] = useState([]);
    const [rideDetails, setRideDetails] = useState(null);
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
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
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

    const fetchRideHistory= useCallback(async()=>{
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
    },[token])

    const fetchRideDetails = useCallback(async (rideId)=>{
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/ride/${rideId}`,{
                headers:{
                    Authorization: token
                }
            });
            const data = response.data;
            data.ride.passengers.push({allPassengers:[{name:"Hulk", age:24, gender:'male'},{name:"Wanda", age:20, gender:'female'},{name:"Thor", age:24, gender:'male'}]})
            // data.ride.passengers.push({allPassengers:[{name:"Black widow", age:25, gender:'female'},{name:"Black Panther", age:29, gender:'male'}]})
            console.log(data);
            if (data.success) {
                setRideDetails(data.ride);
            }
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
    },[token])

    const changeRideStatus = useCallback(async (rideId, status)=>{
        try {
          const backendUrl = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.put(
            `${backendUrl}/ride/updateStatus/${rideId}`,
            { status },
            {
              headers: {
                Authorization: token
              }
            }
          );
          const data = response.data;
          if (data.success) {
            console.log(data.ride);
            setRideDetails(data.ride)
            return true;
          }
        } catch (error) {
          console.log(error.response?.data || error.message || error);
        }
    },[token])

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
          setRides,
          fetchRideDetails,
          rideDetails, 
          changeRideStatus
        }}
      >
        {children}
      </rideContext.Provider>
    );
}