import styles from './ridesList.module.css';
import RideCard from "../../components/rideCard/RideCard";
import { useRideContext } from "../../context/rideContext"
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RidesList() {
    const {rides} = useRideContext();
    const navigate = useNavigate();
    const {searchData} = useRideContext();

    const goBack = useCallback(()=>{
        navigate(-1);
    },[navigate])
    return <div className={styles.main}>
        <div className={styles.header}>
            <button onClick={goBack} className={styles.backButton}><i className={`fi fi-sr-angle-left ${styles.icon}`}></i></button>
            <span className={styles.date}>Rides on {searchData.journeyDate}</span>
        </div>
        <div className={styles.ridesList}>
            {
                rides.map((ride)=><RideCard key={ride._id} ride={ride}/>)
            }
        </div>
    </div>
}