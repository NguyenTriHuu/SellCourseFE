import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useRef, useState, useEffect } from 'react';
import axios from 'src/axios/axios';
import { actions, useStore } from 'src/stores';
import jwtDecode from 'jwt-decode';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import styles from './login.module.scss';
import classNames from 'classnames/bind';

// <AlertCustom />
const Login = () => {
    const location = useLocation();
    const [username, setUserName] = useState(location?.state?.userName || '');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const user = { username, password };
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    const cx = classNames.bind(styles);
    const handleSubmit = () => {
        axios
            .post(`http://localhost:8080/api/login`, user, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(function (response) {
                console.log(response);
                const accessToken = response?.data?.access_token;
                const refreshToken = response?.data?.refresh_token;
                localStorage.setItem('AccessToken', 'Bearer ' + accessToken);
                localStorage.setItem('RefreshToken', refreshToken);
                const token = jwtDecode(accessToken);
                console.log(token?.roles.includes('ADMIN'));
                if (token?.roles.includes('ADMIN')) {
                    navigate('/admin', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
                console.log(token);
                //navigate(from, { replace: true });
                setUser('');
                setPwd('');
                setSuccess(true);
            })
            .catch(function (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else if (err.response?.status === 400) {
                    setErrMsg('Missing Username or Password');
                } else if (err.response?.status === 401) {
                    setErrMsg('Unauthorized');
                } else {
                    setErrMsg('Login Failed');
                }
            });
    };

    useEffect(() => {
        console.log(location);
        console.log(location?.state?.message);
        if (location?.state?.message) {
            setOpen(true);
            setErrMsg(location.state.message);
        }
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);
    return (
        <div className="bg-light min-vh-100  flex-row align-items-center">
            <Collapse in={open} className={cx('alert')}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {location?.state?.message}
                </Alert>
            </Collapse>

            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={4}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm>
                                        <h1>Login</h1>
                                        <p className="text-medium-emphasis">Sign In to your account</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Username"
                                                ref={userRef}
                                                value={username}
                                                required
                                                onChange={(e) => {
                                                    setUserName(e.target.value);
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                required
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                }}
                                            />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs={6}>
                                                <CButton color="primary" className="px-4" onClick={handleSubmit}>
                                                    Login
                                                </CButton>
                                            </CCol>
                                            <CCol xs={6} className="text-right">
                                                <CButton color="link" className="px-0">
                                                    Forgot password?
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default Login;
