import Draw from 'src/assets/images/undraw_confirm_re_69me.svg';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'src/axios/axios';
function WaitConfirm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [shouldPoll, setShouldPoll] = useState(true);
    /* useEffect(() => {
        const checkActivationStatus = () => {
            if (!shouldPoll) return; // Nếu shouldPoll là false, ngừng polling

            fetch(`http://localhost:8080/api/registration/async-deferredresult?userName=${location?.state?.userName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    if (!data) {
                        setTimeout(checkActivationStatus, 5000);
                    } else {
                        console.log('thanh cong');
                        setShouldPoll(false); // Khi có kết quả, cập nhật shouldPoll để ngừng polling
                        // ADD Axios sau
                    }
                })
                .catch((error) => console.error('Error:', error));
        };
        checkActivationStatus();
    }, [shouldPoll]);*/

    const handleClick = () => {
        const user = {
            username: location?.state?.userName,
            password: location?.state?.password,
        };
        console.log(user);
        axios
            .post(`http://localhost:8080/api/login`, user, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            })
            .then(function (response) {
                const accessToken = response?.data?.access_token;
                const refreshToken = response?.data?.refresh_token;
                localStorage.setItem('AccessToken', 'Bearer ' + accessToken);
                localStorage.setItem('RefreshToken', refreshToken);
                navigate('/');
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    return (
        <>
            <div className="grid">
                <p>Please check your email to activate your account</p>
                <div>
                    <img className="object-cover w-[640px] h-[360px] " src={Draw} alt="Add new Video" />
                </div>
                <button onClick={handleClick}>ckckckck</button>
            </div>
        </>
    );
}

export default WaitConfirm;
