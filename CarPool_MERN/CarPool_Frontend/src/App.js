import { RouterProvider } from 'react-router-dom';
import './App.css';
import { RideContextProvider } from './context/rideContext';
import { MapContextProvider } from './context/mapsContext';
import { browserRouter } from './router/browserRouter';
import {BookingContextProvider} from './context/bookingContext';

function App() {
  
  return (
    <div className="App">
      {/*  */}
      <RideContextProvider>
        <BookingContextProvider>
          <MapContextProvider>
            <RouterProvider router={browserRouter} />
          </MapContextProvider>
        </BookingContextProvider>
      </RideContextProvider>
    </div>
  );
}

export default App;
