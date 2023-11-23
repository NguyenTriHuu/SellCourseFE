import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const location = useLocation();
    const refreshToken = localStorage.getItem('RefreshToken');
    return refreshToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
