import { useNavigate } from 'react-router-dom';
import styles from './predictionItem.module.css';
import { useRideContext } from '../../context/rideContext';
import { useMapContext } from '../../context/mapsContext';
export default function PredictionItem({prediction, type}){
    const {clear} = useMapContext();
    const {searchData, setSearchData} = useRideContext();
    const navigate = useNavigate();
    const handleOnClick = (e)=>{
        if (type==='origin') {
            setSearchData({...searchData, from: prediction.mainText})
            navigate("/")
        } else if(type==='destination'){
            setSearchData({...searchData, to: prediction.mainText})
            navigate("/")
        }else{
            return
        }
        clear();
    }
    return <div className={styles.predictionItem} onClick={handleOnClick}>
        <div className={styles.placeName}>{prediction.mainText}</div>
        <div className={styles.placeDescription}>{prediction.description}</div>
    </div>
}