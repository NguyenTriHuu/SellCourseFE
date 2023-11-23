import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './scss/style.scss';
import DefaultLayout from './layout/DefaultLayout';
import RequireAuth from './CustomRoutes/RequireAuth';
import WebLayout from './layout/Weblayout/WebLayout';
import routesAdmin from './routesAdmin';
import routesWeb from './routesWeb';

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
);

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const Check = React.lazy(() => import('./views/pages/register/check'));
const ROLES = {
    User: 'STUDENT',
    Manager: 'MANAGER',
    Admin: 'ADMIN',
};
function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={loading}>
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/register/check" element={<Check />} />
                    <Route exact path="/404" name="Page 404" element={<Page404 />} />
                    <Route exact path="/500" name="Page 500" element={<Page500 />} />
                    <Route element={<RequireAuth />}>
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
                    </Route>

                    <Route element={<RequireAuth />}>
                        {routesAdmin.map((route, idx) => {
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
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
