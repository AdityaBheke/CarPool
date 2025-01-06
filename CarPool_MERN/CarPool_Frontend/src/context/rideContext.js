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
    // Set default date
    const setDate = useCallback(()=>{
        const [month, day, year] = new Date().toLocaleDateString().split("/");
        return `${year}-${month<10?"0"+month:month}-${day<10?"0"+day:day}`;
    },[])

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

    const resetPublishData = useCallback(()=>{
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
    },[setDate])
    // Publish ride
    const publishRide = async (rideData)=>{
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            await axios.post(`${backendUrl}/ride`, rideData,{
                headers:{
                    Authorization: token
                }
            });
            resetPublishData();
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
    }

    const getTimeFromDate = useCallback((dateString)=>{
        const date = new Date(dateString);
        const hh = date.getHours();
        const mm = date.getMinutes();
        return (hh<10?"0"+hh:hh) + ":" + (mm<10?"0"+mm:mm);
    },[])

    const setUpdateData = useCallback(async ()=>{
        setPublishData({
          origin: rideDetails.startLocation.address,
          originId: rideDetails.startLocation.place_id,
          destination: rideDetails.endLocation.address,
          destinationId: rideDetails.endLocation.place_id,
          journeyDate: rideDetails.startTime.split('T')[0],
          startTime: getTimeFromDate(rideDetails.startTime),
          totalSeats: rideDetails.totalSeats,
          farePerPerson: rideDetails.farePerPerson,
          vehicleName: rideDetails.vehicleDetails.vehicleName,
          vehicleColor: rideDetails.vehicleDetails.vehicleColor,
          vehiclePlate: rideDetails.vehicleDetails.vehiclePlate,
          rideId: rideDetails._id
        });
    },[getTimeFromDate, rideDetails])

    const updateRide = async(updateData)=>{
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            await axios.put(`${backendUrl}/ride/${updateData.rideId}`, updateData,{
                headers:{
                    Authorization:token
                }
            })
            resetPublishData();
        } catch (error) {
            console.log(error.response?.data || error.message || error);
        }
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
            // data.ride.passengers.push({allPassengers:[{name:"Hulk", age:24, gender:'male'},{name:"Wanda", age:20, gender:'female'},{name:"Thor", age:24, gender:'male'}]})
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
            setRideDetails(data.ride)
          }
        } catch (error) {
          console.log(error.response?.data || error.message || error);
        }
    },[token])

    const sendSOS = useCallback(async(rideId)=>{
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.get(`${backendUrl}/ride/emergency`,{
                params:{
                    rideId: rideId,
                    lat: 0.00,
                    lng: 0.00
                },
                headers:{
                    Authorization: token
                }
            });
            console.log(response.data);
            
        } catch (error) {
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
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
          changeRideStatus,
          getTimeFromDate,
          setUpdateData,
          updateRide,
          sendSOS
        }}
      >
        {children}
      </rideContext.Provider>
    );
}