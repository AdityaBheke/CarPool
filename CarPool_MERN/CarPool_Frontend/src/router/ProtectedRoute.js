import { Navigate } from "react-router-dom";

export function ProtectedRoute({children}){
    const isLoggedIn= false;
    if (!isLoggedIn) {
        return <Navigate to={'/welcome'} replace={true}/>;
    }else{
        return children;
    }
}