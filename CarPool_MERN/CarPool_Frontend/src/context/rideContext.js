import axios from "axios";
import { createContext, useContext, useState } from "react";

const rideContext = createContext();

export const useRideContext = ()=>{
    const value = useContext(rideContext);
    return value;
}

export function RideContextProvider({children}){
    const [rides, setRides] = useState([]);
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        journeyDate: setDate(),
        reqSeats: 1,
      });
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Set default date
    function setDate(){
        const [month, day, year] = new Date().toLocaleDateString().split("/");
        return `${year}-${month}-${day}`;
    }
    // Search and fetch Rides from backend
    const searchRides = async (criteria)=>{
        setSearchData(criteria);
        try {
            const response = await axios.get(`${backendUrl}/ride/filter`, {params: criteria});
            const data = response.data;
            if (data.success) {
              setRides(data.rides);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <rideContext.Provider value={{rides, searchRides, searchData, setSearchData, setDate}}>
        {children}
    </rideContext.Provider>
}