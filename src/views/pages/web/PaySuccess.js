import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import styles from './scss/PaySuccess.module.scss';
import classNames from 'classnames/bind';
function PaySuccess() {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const idCourse = query.get('idCourse');
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/course/enrolled', { state: { idCourse: idCourse } });
    };

    useEffect(() => {
        axiosPrivate
            .get(`/api/course/enrolled/${idCourse}`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => console.log(error));
    }, []);
    return (
        <>
            <div className="grid " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className={cx('wrapperAlert')}>
                    <div className="contentAlert">
                        <div className={cx('topHalf')}>
                            <p>
                                <svg className={cx('svg')} viewBox="0 0 512 512" width="100" title="check-circle">
                                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                                </svg>
                            </p>
                            <h1>Congratulations</h1>

                            <ul className={cx('bg-bubbles')}>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                                <li className={cx('li')}></li>
                            </ul>
                        </div>

                        <div className={cx('bottomHalf')}>
                            <p>Well Done!, you actually managed to accomplish something today...</p>

                            <button className={cx('button')} id="alertMO" onClick={handleClick}>
                                Moving On
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaySuccess;
