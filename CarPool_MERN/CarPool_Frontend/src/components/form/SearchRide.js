import styles from './searchRide.module.css';
import { useCallback } from "react";
import { useForm } from "../../hooks/useForm";

export default function SearchRide() {

  const setDate = useCallback(() => {
    const [month, day, year] = new Date().toLocaleDateString().split("/");
    return `${year}-${month}-${day}`;
  }, []);

  const [formData, setFormData] = useForm({
    from: "",
    to: "",
    date: setDate(),
    totalPassengers: 1,
  });

  const handleSubmit = useCallback((e)=>{
    e.preventDefault();
  },[])
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
        id="date"
        min={setDate()}
        value={formData.date}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rr-user"></i>
      <input
        type="number"
        id="totalPassengers"
        placeholder="Number of passengers"
        value={formData.totalPassengers}
        onChange={setFormData}
        className={styles.formInput}
      />
      </div>
      <button type='submit' className={styles.search}>Search</button>
    </form>
  );
}
