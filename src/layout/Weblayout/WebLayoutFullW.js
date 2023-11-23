import React from 'react';
import AppHeaderDisAd from 'src/components/web/AppHeaderDisAd';
import styles from './weblayout.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const WebLayout = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <AppHeaderDisAd />
            <div className={cx('container_fw')}>{children}</div>
        </div>
    );
};

export default WebLayout;
