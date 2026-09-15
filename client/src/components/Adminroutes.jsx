import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/Auth";

const AdminRoute = () => {
    const user = getUser();
    const isAuthorized = isLoggedIn() && user?.role === "admin";

    useEffect(() => {
        if (!isAuthorized) {
            window.alert("You are not authorized to access this page.");
        }
    }, [isAuthorized]);

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;