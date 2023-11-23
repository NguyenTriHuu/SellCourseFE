import React from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { Outlet } from 'react-router-dom';

const DefaultLayout = ({ children }) => {
    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-zinc-100">
                <AppHeader />
                <div className="body flex-grow-1 px-3 max-h-max ">{children}</div>
                <AppFooter />
            </div>
        </div>
    );
};

export default DefaultLayout;
