import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from 'src/stores';

function PublicRoute() {
    const [state, dispatch] = useStore();
    const { isAuthenticated } = state;
    const location = useLocation();
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
}

export default PublicRoute;
