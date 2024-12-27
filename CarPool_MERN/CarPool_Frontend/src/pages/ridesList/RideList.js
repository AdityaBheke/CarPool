import styles from './ridesList.module.css';
import RideCard from "../../components/rideCard/RideCard";
import { useRideContext } from "../../context/rideContext"
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RidesList({type}) {
    const {rides, fetchRideHistory} = useRideContext();
    const navigate = useNavigate();
    const {searchData} = useRideContext();

    useEffect(()=>{
      if (type==='history') {
        fetchRideHistory()
      }
    },[fetchRideHistory, type]);

    const goBack = useCallback(()=>{
        navigate(-1);
    },[navigate])
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          {type==="result" && <button onClick={goBack} className={styles.backButton}>
            <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
          </button>}
          <span className={styles.date}>
            {type==='result' && `Rides on ${searchData.journeyDate}`}
            {type==='history' && 'My Rides'}
            </span>
        </div>
        <div className={styles.ridesList}>
          {rides.length > 0 ? (
            rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
          ) : (
            <div className={styles.noDataFound}>No rides found</div>
          )}
        </div>
      </div>
    );
}