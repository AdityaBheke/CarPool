
import styles from './searchLocation.module.css';
import { useMapContext } from '../../context/mapsContext';
import { useNavigate } from 'react-router-dom';
import PredictionItem from '../../components/predictionItem/PredictionItem';

export default function SearchLocation({type}){
    const {handleOnChange, searchText, predictions, clear} = useMapContext();
    const navigate = useNavigate();
    const handleOnClick = (e)=>{
        clear();
        navigate(-1);
    }
    return <div className={styles.main}>
        <div className={styles.header}>
            <button className={styles.backButton} onClick={handleOnClick}>
                <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
            </button>
            <input type='text' className={styles.searchBox} value={searchText} onChange={handleOnChange} placeholder='Search place name'/>
        </div>
        <div>
            {predictions.map((prediction)=><PredictionItem key={prediction.place_id} type={type} prediction={prediction}/>)}
        </div>
    </div>;
}