import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import TabsPageLayout from './components/tabsPage/TabsPageLayout';
import ErrorPage from './pages/errorPage/ErrorPage';
import PublishRide from './pages/publishRide/PublishRide';
import RideHistory from './pages/rideHistory/RideHistory';
import Profile from './pages/profile/Profile';
import { RideContextProvider } from './context/rideContext';
import RidesList from './pages/ridesList/RideList';

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <TabsPageLayout />,
      errorElement:<ErrorPage/>,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path:"/publish",
          element: <PublishRide />,
        },
        {
          path:"/myrides",
          element: <RideHistory />,
        },
        {
          path:"/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: '/welcome',
      element: <div>Landing page</div>
    },
    {
      path: '/signup',
      element: <div>authpages</div>
    },
    {
      path: '/signin',
      element: <div>authpages</div>
    },
    {
      path: '/rides',
      element: <RidesList/>
    }
  ]);
  return (
    <div className="App">
      {/*  */}
      <RideContextProvider>
        <RouterProvider router={browserRouter} />
      </RideContextProvider>
    </div>
  );
}

export default App;
