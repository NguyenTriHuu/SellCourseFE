import React from 'react';
import AppHeaderDisAd from 'src/components/web/AppHeaderDisAd';
import styles from './weblayout.module.scss';
import classNames from 'classnames/bind';
import MenuProfile from 'src/views/menu/MenuProfile';
const cx = classNames.bind(styles);
const WebLayoutProfileTeacher = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <AppHeaderDisAd />
            <div className="grid">
                <div className="row">
                    <div className="col l-3">
                        <MenuProfile />
                    </div>
                    <div className="col l-9">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default WebLayoutProfileTeacher;
