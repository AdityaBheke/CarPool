import { createBrowserRouter } from "react-router-dom";
import TabsPageLayout from './../components/tabsPage/TabsPageLayout';
import ErrorPage from './../pages/errorPage/ErrorPage';
import Home from './../pages/home/Home';
import PublishRide from './../pages/publishRide/PublishRide';
import RideHistory from './../pages/rideHistory/RideHistory';
import RidesList from './../pages/ridesList/RideList';
import Profile from './../pages/profile/Profile';
import SearchLocation from './../pages/searchLocation/SearchLocation';
import LandingPage from './../pages/landingPage/LandingPage';
import { ProtectedRoute } from "./ProtectedRoute";
import AuthPage from './../pages/authPage/AuthPage';

export const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <TabsPageLayout />,
      errorElement:<ErrorPage/>,
      children: [
        {
          index: true,
          element: <ProtectedRoute><Home /></ProtectedRoute>,
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
      element: <LandingPage />
    },
    {
      path: '/signup',
      element: <AuthPage type={'signup'}/>
    },
    {
      path: '/signin',
      element: <AuthPage type={'signin'}/>
    },
    {
      path: '/rides',
      element: <RidesList/>
    },
    {
      path: '/searchOrigin',
      element:<SearchLocation type={"origin"}/>
    },
    {
      path: '/searchDestination',
      element:<SearchLocation type={"destination"}/>
    }
  ]);