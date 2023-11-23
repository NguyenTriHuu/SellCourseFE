import React from 'react';
import {
    CButton,
    CCard,
    CCardBody,
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
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [rePassword, setRePassword] = useState('');

    const [errorPassword, setErrorPassword] = useState('');

    const user = { fullName, email, password };

    const handleClick = () => {
        if (password === rePassword) {
            setErrorPassword('');
            fetch('http://localhost:8080/api/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            })
                .then(() => {
                    navigate('/login', { state: { userName: email } });
                })
                .catch((error) => console.log(error));
        } else {
            setErrorPassword('Password incorrect!!!');
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
                                <CForm>
                                    <h1>Register</h1>
                                    <p className="text-medium-emphasis">Create your account</p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput
                                            placeholder="Fullname"
                                            autoComplete="fullname"
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                            }}
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>@</CInputGroupText>
                                        <CFormInput
                                            placeholder="Email"
                                            autoComplete="email"
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                            }}
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrorPassword('');
                                            }}
                                        />
                                    </CInputGroup>
                                    {errorPassword && <p style={{ color: 'red' }}>{errorPassword}</p>}
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Repeat password"
                                            autoComplete="new-password"
                                            onChange={(e) => {
                                                setRePassword(e.target.value);
                                                setErrorPassword('');
                                            }}
                                        />
                                    </CInputGroup>
                                    <div className="d-grid">
                                        <CButton color="success" onClick={handleClick}>
                                            Create Account
                                        </CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default Register;
