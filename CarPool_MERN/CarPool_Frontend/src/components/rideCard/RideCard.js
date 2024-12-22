import styles from './rideCard.module.css'
export default function RideCard({ride}){
    return (
        // Ride Card
      <div className={styles.rideCard}>
        {/* Ride info */}
        <div className={styles.rideInfo}>
            <div className={styles.routeInfo}>
                <div>{ride.startLocation.address}</div>
                <div className={styles.icon}><i className="fi fi-ts-map-location-track"></i></div>
                <div>{ride.endLocation.address}</div>
            </div>
            <div className={styles.fare}>&#8377;{ride.farePerPerson}</div>
        </div>
        {/* Driver Info */}
        <div className={styles.driverInfo}>
            <i className="fi fi-bs-car"></i>
            <span>Driver</span>
        </div>
      </div>
    );
}