import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import routesAdmin from 'src/routesAdmin';
import routesWeb from 'src/routesWeb';
import AdminRoute from './AdminRoute';
const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
);
const ProtectedRoutes = () => (
    <>
        <Suspense fallback={loading}>
            <Routes>
                {routesWeb.map((route, idx) => {
                    const Layout = route.Layout;
                    return (
                        route.element && (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                element={
                                    <Layout>
                                        <route.element />
                                    </Layout>
                                }
                            />
                        )
                    );
                })}
            </Routes>
        </Suspense>
    </>
);

export default ProtectedRoutes;
