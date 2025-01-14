import { useCallback, useEffect, useState } from 'react';
import styles from './mapPage.module.css';
import { useRideContext } from './../../context/rideContext'
import { socket } from '../../socket/socket';
// import { useDebounce } from '../../hooks/useDebounce';
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

    // Emit/send updated coords to server with roomId
    const refreshLocation = useCallback(({lat, lng})=>{
      socket.emit('locationUpdate', {rideId: rideDetails._id, lat: lat, lng: lng, name:user.name})
    },[rideDetails, user])

    // Join Room related to specific ride on page load;
    useEffect(()=>{
        socket.emit('joinRoom', rideDetails._id)

        return ()=>{
          socket.emit('leaveRoom', rideDetails._id)
        }
    },[rideDetails])

    // Emit/send location to all users again when new user joins the room/ride
    useEffect(()=>{
      const handleNewUserJoined = ()=>{
        console.log('new user joined');
        refreshLocation(location);
      }
      socket.on('newUserJoined', handleNewUserJoined);

      return ()=>{
        socket.off('newUserJoined', handleNewUserJoined)
      }
    },[location, refreshLocation])

    // Track live location of user
    useEffect(()=>{
        console.log('Rerender');
        
        if (navigator.geolocation) {
            // Watch position of user continuously.
            const watchId = navigator.geolocation.watchPosition((position)=>{
                const {latitude, longitude} = position.coords;
                // Refresh location only when lat-lng are changed
                setLocation((prev)=>{
                  if (prev.lat !== latitude || prev.lng !== longitude) {
                    refreshLocation({lat: latitude, lng: longitude})
                    return {lat: latitude, lng: longitude}
                  }
                  return prev
                })
            },(error)=>{
                console.log("Error while watching position", error);
            })
            // Clear Up watchPostion
            return (()=>{navigator.geolocation.clearWatch(watchId)})
        }
    },[refreshLocation]);

    useEffect(()=>{
        socket.on('newLocation', ({id, lat, lng, name})=>{
            // Set locations of every user except own in otherLocations array
            setOtherLocations((prev)=>[...prev.filter(loc=>loc.id!==id),{id, lat, lng, name}])
            console.log(`Current name: ${user.name}, Received Name: ${name}`);
        })

        return ()=>{
          socket.off('newLocation')
        }
    },[user])

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