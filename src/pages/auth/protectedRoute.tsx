import { Navigate } from "react-router-dom";
import { authService } from "./auth";

type Props = {
    children: any;
};

const ProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
};

export default ProtectedRoute;