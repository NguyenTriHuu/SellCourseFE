import React from 'react';

//Web
const MyCourse = React.lazy(() => import('./views/pages/web/MyCourse'));
const Course = React.lazy(() => import('./views/pages/web/Course'));
const Introduction = React.lazy(() => import('./views/pages/web/Introduction'));
const Profile = React.lazy(() => import('./views/profiles/EditProfile'));
const Learning = React.lazy(() => import('./views/pages/web/Learning'));
const Enrolled = React.lazy(() => import('./views/pages/web/Enrolled'));
const PaySuccess = React.lazy(() => import('./views/pages/web/PaySuccess'));
const CourseTaught = React.lazy(() => import('./views/pages/web/CourseTaught'));
const CourseUpdate = React.lazy(() => import('./views/pages/web/UpdateCourse'));
//Layouts
const WebLayout = React.lazy(() => import('./layout/Weblayout/WebLayout'));
const WebLayoutFW = React.lazy(() => import('./layout/Weblayout/WebLayoutFullW'));
const WebLayoutprofile = React.lazy(() => import('./layout/Weblayout/WebLayoutEditProfit'));
const WebLayoutEnrolled = React.lazy(() => import('./layout/Weblayout/WebLayoutEnrolled'));
const WebLayoutLearn = React.lazy(() => import('./layout/Weblayout/WebLayoutLearn'));
const routesWeb = [
    { path: '/', exact: true, name: 'Home', element: MyCourse, Layout: WebLayout },
    { path: '/mycourse', name: 'MyCourse', element: MyCourse, Layout: WebLayout },
    { path: '/course', name: 'Course', element: Course, Layout: WebLayout },
    { path: '/course/introduce', name: 'Introduce', element: Introduction, Layout: WebLayoutFW },
    { path: '/current_user/profile', name: 'profile', element: Profile, Layout: WebLayoutprofile },
    { path: '/learning', name: 'Learning', element: Learning, Layout: WebLayoutLearn },
    { path: '/course/enrolled', name: 'Enrolled', element: Enrolled, Layout: WebLayoutEnrolled },
    { path: '/course/pay/success', name: 'PaySuccess', element: PaySuccess, Layout: WebLayoutFW },
    { path: '/course/taught', name: 'CourseTaught', element: CourseTaught, Layout: WebLayoutFW },
    { path: '/course/update', name: 'CourseUpdate', element: CourseUpdate, Layout: WebLayoutEnrolled },
];

export default routesWeb;
