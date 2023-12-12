import { useEffect, useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import styles from './scss/Course.module.scss';
import classNames from 'classnames/bind';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'src/views/image/Image';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';

function MyCourse() {
    const axiosPrivate = useAxiosPrivate();
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const cx = classNames.bind(styles);
    const [search, setSearch] = useState('');
    const {
        status: statusRecommend,
        data: dataRecommend,
        error: errorRecommend,
    } = useQuery({
        queryKey: ['courseEnrolled'],
        queryFn: async () => {
            const res = await axiosPrivate.get(`/api/course/get/registration/${token?.sub}`);
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

    console.log(dataRecommend);

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleEnterSearch = (event) => {
        if (event.key === 'Enter') {
            axiosPrivate
                .get(`/api/blog/search/${token?.sub}`, { params: { search: search } })
                .then((res) => setData([...res?.data]))
                .catch((e) => console.log(e));
        }
    };

    return (
        <>
            <div className="grid.wide">
                <div className={cx('search')}>
                    <input
                        type="text"
                        className={cx('search__input')}
                        placeholder="Type your text"
                        value={search}
                        onChange={handleChangeSearch}
                        onKeyDown={handleEnterSearch}
                    />
                    <button className={cx('search__button')}>
                        <svg className={cx('search__icon')} aria-hidden="true" viewBox="0 0 24 24">
                            <g>
                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                        </svg>
                    </button>
                </div>
                <h1 className="mt-5">My Course</h1>
                {statusRecommend === 'loading' ? (
                    <p>Loading...</p>
                ) : statusRecommend === 'error' ? (
                    <span>Error: {errorRecommend.message}</span>
                ) : (
                    <div className="row">
                        {dataRecommend ? (
                            dataRecommend.map((course) => (
                                <div className={`${cx('segment')} col l-4`} key={uuidv4()}>
                                    <Card item={course} />
                                </div>
                            ))
                        ) : (
                            <>
                                <h1>not data</h1>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function Card({ item }) {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [url, setUrl] = useState('/course/introduce');
    useEffect(() => {
        axiosPrivate
            .get(`/api/course/enrolled/check/${item?.id}`)
            .then((res) => {
                if (res.data === true) setUrl('/course/enrolled');
            })
            .catch((error) => console.log(error));
    }, [item]);
    console.log(url);
    const handleClick = () => {
        navigate(url, { state: { idCourse: item?.id } });
    };
    return (
        <div id={item?.id} className={`${cx('card')}`} onClick={handleClick}>
            <div id={`card_img_${item?.id}`} className={cx('card-image')}>
                <Image
                    id={item?.id}
                    url={`http://localhost:8080/api/course/thumdnail/${item?.id}/download`}
                    queryKey="thumbnail"
                />
            </div>
            <p className={cx('card-title')}>{item.title}</p>
            <p className={cx('card-body')} dangerouslySetInnerHTML={{ __html: item.shortDescription }} />
            <p className={cx('footer')}>
                <Avatar alt="Remy Sharp" src={item?.avatar || null} />
                Written by <span className={cx('by-name')}>{item?.fullNameTeacher}</span> on{' '}
            </p>
        </div>
    );
}
export default MyCourse;
