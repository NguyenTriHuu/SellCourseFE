import React from 'react';
import styles from './weblayout.module.scss';
import { Disclosure } from '@headlessui/react';
import Button from '@mui/material/Button';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
const cx = classNames.bind(styles);
const WebLayoutMyProfile = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <AppHeader />
            <div className={cx('container_fw-e')}>{children}</div>
        </div>
    );
};

function AppHeader() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Disclosure as="nav" className={cx('wrapper-header')}>
            {({ open }) => (
                <>
                    <div className={`w-full px-2 sm:px-6 lg:px-8 relative`}>
                        <div className="flex h-16 absolute left-2 px-3 mx-3">
                            <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Button onClick={handleClick}>
                                    <KeyboardArrowLeftIcon style={{ color: 'white' }} fontSize="large" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}

export default WebLayoutMyProfile;
