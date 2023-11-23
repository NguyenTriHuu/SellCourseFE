import React from 'react';
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const EditCourse = React.lazy(() => import('./views/pages/admin/EditCourse'));
const AddCourse = React.lazy(() => import('./views/pages/admin/AddCourse'));
//Layouts
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const routesAdmin = [
    { path: '/', exact: true, name: 'Home', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin', exact: true, name: 'Home', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin/editcourse', name: 'EditCourse', element: EditCourse, Layout: DefaultLayout },
    { path: '/admin/editcourse/add', name: 'EditCourse', element: AddCourse, Layout: DefaultLayout },
];

export default routesAdmin;
