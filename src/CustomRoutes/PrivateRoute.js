import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from 'src/stores';
function PrivateRoute({ allowedRoles }) {
    const [state, dispatch] = useStore();
    const { isAuthenticated, roles } = state;
    console.log(isAuthenticated);
    console.log(roles);
    const location = useLocation();

    return isAuthenticated && roles?.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default PrivateRoute;
