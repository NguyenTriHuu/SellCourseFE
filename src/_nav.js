import React from 'react';
import CIcon from '@coreui/icons-react';
import {
    cilBell,
    cilCalculator,
    cilChartPie,
    cilCursor,
    cilDescription,
    cilDrop,
    cilNotes,
    cilPencil,
    cilPuzzle,
    cilSpeedometer,
    cilStar,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
            color: 'info',
            text: 'NEW',
        },
    },
    {
        component: CNavItem,
        name: 'Edit Course',
        to: '/admin/editcourse',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
            color: 'info',
            text: 'NEW',
        },
    },
    {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Buttons',
                to: '/buttons/buttons',
            },
            {
                component: CNavItem,
                name: 'Buttons groups',
                to: '/buttons/button-groups',
            },
            {
                component: CNavItem,
                name: 'Dropdowns',
                to: '/buttons/dropdowns',
            },
        ],
    },
];

export default _nav;
