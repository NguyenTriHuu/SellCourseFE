import React from 'react';
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const EditCourse = React.lazy(() => import('./views/pages/admin/EditCourse'));
const AddCourse = React.lazy(() => import('./views/pages/admin/AddCourse'));
const Category = React.lazy(() => import('./views/pages/admin/CategoryManagement'));
const Program = React.lazy(() => import('./views/pages/admin/ProgramManagement'));
const Subject = React.lazy(() => import('./views/pages/admin/SubjectManagement'));
//Layouts
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const routesAdmin = [
    { path: '/', exact: true, name: 'Home', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin', exact: true, name: 'Home', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard, Layout: DefaultLayout },
    { path: '/admin/editcourse', name: 'EditCourse', element: EditCourse, Layout: DefaultLayout },
    { path: '/admin/editcourse/add', name: 'EditCourse', element: AddCourse, Layout: DefaultLayout },
    { path: '/admin/category', name: 'Category', element: Category, Layout: DefaultLayout },
    { path: '/admin/program', name: 'Program', element: Program, Layout: DefaultLayout },
    { path: '/admin/subject', name: 'Subject', element: Subject, Layout: DefaultLayout },
];

export default routesAdmin;
