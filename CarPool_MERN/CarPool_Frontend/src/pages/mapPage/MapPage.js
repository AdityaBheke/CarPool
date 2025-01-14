import { useCallback, useEffect, useState } from 'react';
import styles from './mapPage.module.css';
import { useRideContext } from './../../context/rideContext'
import { socket } from '../../socket/socket';
import { useDebounce } from '../../hooks/useDebounce';
import {useAuthContext} from './../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
export default function MapPage() {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })
    const navigate = useNavigate();
    const {rideDetails} = useRideContext();
    const {user} = useAuthContext();
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [otherLocations, setOtherLocations] = useState([]);

    // TODO: Optimize this
    // TO update own location
    const debouncedOwnUpdate = useDebounce(({lat, lng})=>{
        setLocation({lat, lng});
    },3000)
    const handleOwnLocationUpdate = useCallback(({lat, lng})=>{
        debouncedOwnUpdate({lat, lng})
    },[debouncedOwnUpdate])

    // To update location of all connected users
    const debouncedOtherUpdate = useDebounce(({id, lat, lng, name})=>{
        setOtherLocations((prev)=>[...prev.filter(loc=>loc.id!==id),{id, lat, lng, name}])
        console.log(`Current name: ${user.name}, Received Name: ${name}`);
    },3000)
    const handleOtherLocationUpdate = useCallback(({id, lat, lng, name})=>{
        debouncedOtherUpdate({id, lat, lng, name})
    },[debouncedOtherUpdate])

    // Join Room related to specific ride on page load;
    useEffect(()=>{
        socket.emit('joinRoom', rideDetails._id)
    },[rideDetails])

    // Track live location of user
    useEffect(()=>{
        console.log('Rerender');
        
        if (navigator.geolocation) {
            // Watch position of user continuously.
            const watchId = navigator.geolocation.watchPosition((position)=>{
                const {latitude, longitude} = position.coords;
                // Refresh location only when lat-lng ara changed
                if (location.lat !== latitude || location.lng !== longitude) {
                  // Update user's current location
                  handleOwnLocationUpdate({lat:latitude, lng:longitude});
                  
                }
                // Emit/send updated coords to server with roomId
                  socket.emit('locationUpdate', {rideId: rideDetails._id, lat: latitude, lng: longitude, name:user.name})
            },(error)=>{
                console.log("Error while watching position", error);
            })
            // Clear Up watchPostion
            return (()=>{navigator.geolocation.clearWatch(watchId)})
        }
    },[rideDetails, handleOwnLocationUpdate, user, location]);

    useEffect(()=>{
        socket.on('newLocation', ({id, lat, lng, name})=>{
            // Set locations of every user except own in otherLocations array
            handleOtherLocationUpdate({id, lat, lng, name})
        })
    },[handleOtherLocationUpdate])

    const goBack = useCallback(()=>{
        navigate(-1);
    },[navigate])
    
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <button onClick={goBack} className={styles.backButton}>
            <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
          </button>
          <div className={styles.pageHead}>Map</div>
        </div>
        {isLoaded ? (
          <div className={styles.mapContainer}>
            <GoogleMap
              center={location}
              zoom={11}
              mapContainerStyle={{ height: "100%", width: "100%" }}
            >
              {/* TODO: Replace hardcoded lat-lng with location state */}
              {/* Marker for own location */}
              <Marker
                position={{lat: 19.0084865, lng: 73.937309}}
                label={{
                    text: 'You',
                    color:'black',
                    fontSize: '18px',
                    className: styles.markerLabel
                }}
              />
              {/* Markers for location of all connected users */}
              {otherLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  label={{
                    text: loc.name,
                    color:'black',
                    fontSize: '18px',
                    className: styles.markerLabel
                  }}
                />
              ))}
            </GoogleMap>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
}