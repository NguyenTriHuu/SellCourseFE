import React from 'react';
import styles from './weblayout.module.scss';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Button from '@mui/material/Button';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { actions, useStore } from 'src/stores';
const cx = classNames.bind(styles);
const WebLayoutEnrolled = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <div className={cx('container_fw-e')}>{children}</div>
        </div>
    );
};

function AppHeader() {
    const navigation = [
        { name: 'Course', href: '/course', current: false },
        { name: 'My Course', href: '/mycourse', current: false },
        { name: 'Class live', href: '#', current: false },
        { name: 'Calendar', href: '#', current: false },
    ];

    const [state, dispatch] = useStore();
    const { idLesson } = state;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    const handleClickNext = () => {};

    return (
        <Disclosure as="nav" className={cx('wrapper-header')}>
            <>
                <div className={`w-full px-2 sm:px-6 lg:px-8 relative`}>
                    <div className="flex h-16 absolute left-2 px-3 mx-3">
                        <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <Button onClick={handleClick}>
                                <KeyboardArrowLeftIcon style={{ color: 'white' }} fontSize="large" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex h-16 absolute right-2 px-3 mx-3">
                        <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button
                                onClick={handleClickNext}
                                class="cursor-pointer px-8 py-1 bg-red-500 bg-opacity-80 text-[#f1f1f1] hover:bg-opacity-90 transition font-semibold shadow-md h-10"
                            >
                                <KeyboardDoubleArrowRightIcon />
                                Next Lesson
                            </button>
                        </div>
                    </div>
                </div>
            </>
        </Disclosure>
    );
}

export default WebLayoutEnrolled;
