import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/Auth";

const ProtectedRoute = () => {
    const user = getUser();

    if (!isLoggedIn() || !user || user.role !== "user") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;