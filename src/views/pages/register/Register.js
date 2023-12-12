import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Paper from '@mui/material/Paper';

const Register = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [rePassword, setRePassword] = useState('');

    const [dateOfBirth, setDayOfBirth] = useState('');

    const [errorPassword, setErrorPassword] = useState('');

    const user = { fullName, email, password, dateOfBirth: new Date(dateOfBirth) };

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
        <>
            <div className="Grid">
                <Paper elevation={3}>
                    <div className="px-7 h-screen grid justify-center items-center bg-slate-200">
                        <div className="grid gap-6" id="form">
                            <div className="w-full grid justify-items-center">
                                <p className="text-3xl">Đăng kí</p>
                            </div>
                            <div className="w-full flex gap-3">
                                <input
                                    className="capitalize shadow-2xl p-3 ex w-full outline-none focus:border-solid focus:border-[1px] border-[#035ec5] placeholder:text-black"
                                    type="text"
                                    placeholder="Tên đầy đủ"
                                    id="fullName"
                                    name="fullName"
                                    required=""
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-6 w-full">
                                <input
                                    className="p-3 shadow-2xl  glass w-full placeholder:text-black outline-none focus:border-solid border-[#035ec5] focus:border-[1px]"
                                    type="Email"
                                    placeholder="Email"
                                    id="Email"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    className="p-3 shadow-2xl   glass w-full text-black outline-none focus:border-solid focus:border-[1px]border-[#035ec5]"
                                    type="date"
                                    required=""
                                    onChange={(e) => {
                                        setDayOfBirth(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    className="p-3 glass shadow-2xl  w-full placeholder:text-black outline-none focus:border-solid focus:border-[1px] border-[#035ec5]"
                                    type="password"
                                    placeholder="Password"
                                    id="password"
                                    name="password"
                                    required=""
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    className="p-3 glass shadow-2xl  w-full placeholder:text-black outline-none focus:border-solid focus:border-[1px] border-[#035ec5]"
                                    type="password"
                                    placeholder="Confirm password"
                                    required=""
                                    onChange={(e) => setRePassword(e.target.value)}
                                />
                            </div>
                            <button
                                className="outline-none glass shadow-2xl  w-full p-3  bg-[#ffffff42] hover:border-[#035ec5] hover:border-solid hover:border-[1px]  hover:text-[#035ec5] font-bold"
                                type="submit"
                                onClick={handleClick}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </Paper>
            </div>
        </>
    );
};

export default Register;

/*  <CContainer>
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
            </CContainer> */
