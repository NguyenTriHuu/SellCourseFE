import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from 'src/stores';
function AdminRoute() {
    const [state, dispatch] = useStore();
    const { isAuthenticated, roles } = state;
    const location = useLocation();
    console.log(roles);
    if (isAuthenticated) {
        if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
            return <Outlet />;
        } else {
            <Navigate to="/login" state={{ from: location }} replace />;
        }
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AdminRoute;
