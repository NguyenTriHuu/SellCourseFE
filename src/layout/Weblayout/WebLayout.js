import React from 'react';
import AppHeaderDisAd from 'src/components/web/AppHeaderDisAd';
import WebContent from 'src/components/web/WebContent';
import styles from './weblayout.module.scss';
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
//body flex-grow-1 px-6
//"wrapper d-flex flex-column min-vh-100 bg-light"
//{cx('wrapper')}
const cx = classNames.bind(styles);
const WebLayout = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <AppHeaderDisAd />
            <div className={cx('container')}>{children}</div>
        </div>
    );
};

export default WebLayout;
