import { useCallback, useEffect, useState } from 'react';
import styles from './mapPage.module.css';
import { useRideContext } from './../../context/rideContext'
import { socket } from '../../socket/socket';
import { useDebounce } from '../../hooks/useDebounce';
import {useAuthContext} from './../../context/authContext';
export default function MapPage() {
    const {rideDetails} = useRideContext();
    const {user} = useAuthContext();
    const [location, setLocation] = useState({lat: 0, lng: 0});
    // const [otherLocations, setOtherLocations] = useState([]);

    // TODO: Optimize this
    const debouncedUpdate = useDebounce(({lat, lng})=>{
        setLocation({lat, lng});
    },3000)
    const handleLocationUpdate = useCallback((location)=>{
        debouncedUpdate(location)
    },[debouncedUpdate])

    // Join Room related to specific ride on page load;
    useEffect(()=>{
        socket.emit('joinRoom',rideDetails._id)
    },[rideDetails])

    // Track live location of user
    useEffect(()=>{
        console.log('Rerender');
        
        if (navigator.geolocation) {
            // Watch position of user continuously.
            const watchId = navigator.geolocation.watchPosition((position)=>{
                const {latitude, longitude} = position.coords;
                // Update user's current location
                handleLocationUpdate({lat:latitude, lng:longitude});
                // Emit/send updated coords to server with roomId
                socket.emit('locationUpdate', {rideId: rideDetails._id, lat: latitude, lng: longitude, name:user.name})
            },(error)=>{
                console.log("Error while watching position", error);
            })
            // Clear Up watchPostion
            return (()=>{navigator.geolocation.clearWatch(watchId)})
        }
    },[rideDetails, handleLocationUpdate, user]);

    useEffect(()=>{
        socket.on('newLocation', ({id, lat, lng, name})=>{
            // Set locations of every user except own in otherLocations array
            // setOtherLocations((prev)=>[...prev.filter(loc=>loc.id!==id), {id, lat, lng}])
            console.log(`Current user: ${user.name} Received User: ${name}`);
            
        })
    },[user])
    
    return <div className={styles.main}>
        {`My Location ${location.lat}, ${location.lng}`}
        {/* {console.log("Other locations: ", otherLocations)} */}
    </div>
}