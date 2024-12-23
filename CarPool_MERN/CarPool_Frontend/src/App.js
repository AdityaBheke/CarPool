import { RouterProvider } from 'react-router-dom';
import './App.css';
import { RideContextProvider } from './context/rideContext';
import { MapContextProvider } from './context/mapsContext';
import { browserRouter } from './router/browserRouter';

function App() {
  
  return (
    <div className="App">
      {/*  */}
      <RideContextProvider>
        <MapContextProvider>
          <RouterProvider router={browserRouter} />
        </MapContextProvider>
      </RideContextProvider>
    </div>
  );
}

export default App;
