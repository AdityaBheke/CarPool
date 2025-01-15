import { useNavigate, useParams } from 'react-router-dom';
import styles from './rideDetails.module.css';
import { useCallback, useEffect } from 'react';
import { useRideContext } from '../../context/rideContext';
import { useAuthContext } from '../../context/authContext';
import { useBookingContext } from '../../context/bookingContext';
export default function RideDetails(){
    const {user} = useAuthContext();
    const {rideId} = useParams();
    const {fetchRideDetails, rideDetails, changeRideStatus, getTimeFromDate, setUpdateData, sendSOS} = useRideContext();
    const {cancelBooking} = useBookingContext();
    const navigate = useNavigate();
    useEffect(()=>{
        fetchRideDetails(rideId);
    },[fetchRideDetails, rideId]);

    const goBack = useCallback(()=>{
            navigate(-1);
        },[navigate])
    
    const handleBookRide = useCallback(()=>{
        // navigate to book ride page
        navigate('/bookRide')
    },[navigate])
    const handleUpdateBooking = useCallback(()=>{
      // navigate to update booking page
      navigate('/updateBooking')
    },[navigate])
    const handleCancelBooking = useCallback(async(e)=>{
        const booking = rideDetails.passengers.find((booking)=>booking.primaryPassenger===user._id);
            if (booking) {
                await cancelBooking(rideDetails._id, booking.bookingId)
                navigate(-1);
            }
    },[navigate,cancelBooking, rideDetails, user])
    const handleUpdateRide = useCallback(()=>{
        setUpdateData();
        navigate("/updateRide")
    },[navigate,setUpdateData])
    const handleStartRide = useCallback(()=>{
        // call startRide function
        changeRideStatus(rideId, "started")
    },[changeRideStatus,rideId])
    const handleCancelRide = useCallback(()=>{
        // call cancelRide function
        changeRideStatus(rideId, "cancelled")
    },[changeRideStatus,rideId])
    const handleFinishRide = useCallback(()=>{
        // call finishRide function
        changeRideStatus(rideId, "completed")
    },[changeRideStatus,rideId])

    const handleOpenMap = useCallback(()=>{
      navigate('/map');
    },[navigate])

    const handleSOS = useCallback(()=>{
      if (user?.emergencyContacts?.length>0) {
        // Send SOS function
        sendSOS(rideId);
      }else{
        navigate('/addEmergency')
      }
    },[navigate, user, sendSOS, rideId])
    

    return (
      <>
        <div className={styles.main}>
          <div className={styles.header}>
            <button onClick={goBack} className={styles.backButton}>
              <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
            </button>
            <div className={styles.pageHead}>Ride Details</div>
          </div>
          <div className={styles.infoContainer}>
            {/* Route Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Route</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>From:</div>
              <div className={styles.infoValue}>
                {rideDetails?.startLocation?.address}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>To:</div>
              <div className={styles.infoValue}>
                {rideDetails?.endLocation?.address}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Distance:</div>
              <div className={styles.infoValue}>
                {rideDetails?.distance / 1000} KM
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Journey date:</div>
              <div className={styles.infoValue}>{rideDetails?.startTime.split('T')[0]}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Start Time:</div>
              <div className={styles.infoValue}>{getTimeFromDate(rideDetails?.startTime)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Total Seats:</div>
              <div className={styles.infoValue}>{rideDetails?.totalSeats}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Available seats:</div>
              <div className={styles.infoValue}>
                {rideDetails?.availableSeats}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Fare:</div>
              <div className={styles.infoValue}>
              &#8377;{rideDetails?.farePerPerson}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Status</div>
              <div
                className={`${styles.infoValue} ${styles.status} ${
                  styles[rideDetails?.status]
                }`}
              >
                {rideDetails?.status}
              </div>
            </div>
          </div>
          {/* Vehicle Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Vehicle</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Model Name:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehicleName}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Color:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehicleColor}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Number plate:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehiclePlate}
              </div>
            </div>
          </div>
          {/* Owner Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Owner</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Name:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.name}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Mobile:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.mobile}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Gender:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.gender}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Age:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.age}
              </div>
            </div>
          </div>
          {/* Passenger Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Passenger Info</div>
            <div className={styles.passengerContainer}>
              {rideDetails?.passengers?.length > 0
                ? rideDetails?.passengers?.map((booking) =>
                    booking.allPassengers?.map((passenger, index) => (
                      <div key={index} className={styles.passengerItem}>
                        <div className={styles.passengerName}>
                          {passenger.name}
                        </div>
                        <div className={styles.passengerGender}>
                          {passenger.gender}
                        </div>
                        <div className={styles.passengerAge}>
                          {passenger.age}
                        </div>
                      </div>
                    ))
                  )
                : "No Passengers Found"}
            </div>
          </div>
          </div>
        </div>
        <div className={styles.rideActions}>
          <div className={styles.buttonContainer}>
          {rideDetails?.status === "active" ? (
            user._id === rideDetails?.driverId._id ? (
              <>
                <button onClick={handleCancelRide} className={`${styles.button} ${styles.cancelButton}`}>Cancel Ride</button>
                <button onClick={handleUpdateRide} className={`${styles.button} ${styles.updateButton}`}>Update</button>
                <button onClick={handleStartRide} className={styles.button}>Start</button>
              </>
            ) : (
              rideDetails?.passengers?.find((booking)=>booking.primaryPassenger===user._id) ?(
              <>
                <button onClick={handleCancelBooking} className={`${styles.button} ${styles.cancelButton}`}>Cancel Booking</button>
                <button onClick={handleUpdateBooking} className={styles.button}>Update Booking</button>
              </> ):(
                <><button onClick={handleBookRide} className={styles.button}>Book Ride</button></>
              )
            )
          ) : rideDetails?.status === "started" ? (
            user._id === rideDetails?.driverId._id ? (
              <>
                <button onClick={handleOpenMap} className={`${styles.button} ${styles.updateButton}`}>Open Map</button>
                <button onClick={handleFinishRide} className={styles.button}>Finish Ride</button>
              </>
            ) : (
              rideDetails?.passengers?.find((booking)=>booking.primaryPassenger===user._id)?(<>
                <button onClick={handleOpenMap} className={`${styles.button} ${styles.updateButton}`}>Open Map</button>
                <button onClick={handleSOS} className={`${styles.button} ${styles.cancelButton}`}>SOS</button>
              </>):(
                <div className={styles.statusMessage}>{rideDetails?.status}</div>
              )
            )
          ) : (
            <div className={styles.statusMessage}>{rideDetails?.status}</div>
          )}
        
          </div>
        </div>
      </>
    );
}