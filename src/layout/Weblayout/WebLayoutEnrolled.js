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
const cx = classNames.bind(styles);
const WebLayoutEnrolled = ({ children }) => {
    return (
        <div className="wrapper d-flex flex-column min-vh-100 bg-white items-center">
            <AppHeader />
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

    function ClassNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const handelLogOut = () => {
        localStorage.clear();
    };
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
                        <div className="flex h-16 absolute right-2 px-3 mx-3">
                            <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={ClassNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm text-gray-700',
                                                        )}
                                                        onClick={() =>
                                                            navigate('/current_user/profile', { state: { id: idUser } })
                                                        }
                                                    >
                                                        Your Profile
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="#"
                                                        className={ClassNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm text-gray-700',
                                                        )}
                                                    >
                                                        Settings
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/login"
                                                        className={ClassNames(
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm text-gray-700',
                                                        )}
                                                        onClick={handelLogOut}
                                                    >
                                                        Sign out
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}

export default WebLayoutEnrolled;
