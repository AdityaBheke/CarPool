import styles from './searchRide.module.css';
import { useCallback } from "react";
import { useForm } from "../../hooks/useForm";
import { useRideContext } from '../../context/rideContext';
import { useNavigate } from 'react-router-dom';

export default function SearchRide() {

  const {searchRides, searchData, setDate} = useRideContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useForm(searchData);

  const handleSubmit = useCallback((e)=>{
    e.preventDefault();
    searchRides(formData);
    navigate('/rides')
  },[formData, searchRides, navigate])

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formItem}>
      <i className="fi fi-rs-marker"></i>
      <input
        type="text"
        id="from"
        placeholder="Leaving from"
        value={formData.from}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rs-marker"></i>
      <input
        type="text"
        id="to"
        placeholder="Going to"
        value={formData.to}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rr-calendar-day"></i>
      <input
        type="date"
        id="journeyDate"
        min={setDate()}
        value={formData.journeyDate}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rr-user"></i>
      <input
        type="number"
        id="reqSeats"
        placeholder="Number of passengers"
        value={formData.reqSeats}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <button type='submit' className={styles.search}>Search</button>
    </form>
  );
}
