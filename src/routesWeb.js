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
const CreateCourse = React.lazy(() => import('./views/pages/web/CreateCourse'));
const MyProfile = React.lazy(() => import('./views/pages/web/MyProfile'));
const Blog = React.lazy(() => import('./views/pages/web/Blog'));
const BlogDetail = React.lazy(() => import('./views/pages/web/BlogDetail'));
const CreateBlog = React.lazy(() => import('./views/pages/web/CreateBlog'));
const MyBlog = React.lazy(() => import('./views/pages/web/MyBlog'));
const UpdateBlog = React.lazy(() => import('./views/pages/web/UpdateBlog'));
//Layouts
const WebLayout = React.lazy(() => import('./layout/Weblayout/WebLayout'));
const WebLayoutFW = React.lazy(() => import('./layout/Weblayout/WebLayoutFullW'));
const WebLayoutprofile = React.lazy(() => import('./layout/Weblayout/WebLayoutEditProfit'));
const WebLayoutEnrolled = React.lazy(() => import('./layout/Weblayout/WebLayoutEnrolled'));
const WebLayoutLearn = React.lazy(() => import('./layout/Weblayout/WebLayoutLearn'));
const WebLayoutMyProfile = React.lazy(() => import('./layout/Weblayout/WebLayoutMyProfile'));

const routesWeb = [
    { path: '/', exact: true, name: 'Home', element: MyCourse, Layout: WebLayout },
    { path: '/mycourse', name: 'MyCourse', element: MyCourse, Layout: WebLayout },
    { path: '/blog', name: 'Blog', element: Blog, Layout: WebLayout },
    { path: '/blog/read', name: 'BlogDetail', element: BlogDetail, Layout: WebLayout },
    { path: '/myblog', name: 'MyBlog', element: MyBlog, Layout: WebLayout },
    { path: '/blog/create', name: 'CreateBlog', element: CreateBlog, Layout: WebLayout },
    { path: '/blog/update', name: 'UpdateBlog', element: UpdateBlog, Layout: WebLayout },
    { path: '/course', name: 'Course', element: Course, Layout: WebLayout },
    { path: '/course/introduce', name: 'Introduce', element: Introduction, Layout: WebLayoutFW },
    { path: '/current_user/profile', name: 'profile', element: Profile, Layout: WebLayoutprofile },
    { path: '/learning', name: 'Learning', element: Learning, Layout: WebLayoutLearn },
    { path: '/course/enrolled', name: 'Enrolled', element: Enrolled, Layout: WebLayoutEnrolled },
    { path: '/course/pay/success', name: 'PaySuccess', element: PaySuccess, Layout: WebLayoutFW },
    { path: '/course/taught', name: 'CourseTaught', element: CourseTaught, Layout: WebLayoutFW },
    { path: '/course/update', name: 'CourseUpdate', element: CourseUpdate, Layout: WebLayoutEnrolled },
    { path: '/course/create', name: 'CourseCreate', element: CreateCourse, Layout: WebLayoutEnrolled },
    { path: '/myprofile', name: 'MyProfile', element: MyProfile, Layout: WebLayoutMyProfile },
];

export default routesWeb;
