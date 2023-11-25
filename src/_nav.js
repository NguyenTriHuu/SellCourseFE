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
    cilBriefcase,
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
        icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
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
    {
        component: CNavGroup,
        name: 'Category Management',
        icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Category',
                to: '/admin/category',
            },
            {
                component: CNavItem,
                name: 'Program',
                to: '/admin/program',
            },
            {
                component: CNavItem,
                name: 'Subject',
                to: '/admin/subject',
            },
        ],
    },
];

export default _nav;
