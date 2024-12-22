import styles from './home.module.css';
import backgroundImage from './../../assets/images/home-bg.png'
import SearchRide from '../../components/searchRide/SearchRide';

export default function Home() {
    return (
      <div className={styles.main}>
        <img src={backgroundImage} alt="home-background" className={styles.homeBackground}/>
        <SearchRide/>
      </div>
    );
}