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
const ProtectedRoutesAdmin = () => (
    <>
        <Suspense fallback={loading}>
            <Routes>
                {routesAdmin.map((route, idx) => {
                    const Layout = route.Layout;
                    const Element = route.element;
                    return (
                        route.element && (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                element={
                                    <Layout>
                                        <Element />
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

export default ProtectedRoutesAdmin;
