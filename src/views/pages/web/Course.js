import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import styles from './scss/Course.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'src/views/image/Image';

export default function Course() {
    const cx = classNames.bind(styles);
    const axiosPrivate = useAxiosPrivate();
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueryData('projects');
    const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['projects'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosPrivate.get('/api/courses', { params: { page: pageParam, rowsPerPage: 6 } });
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        getPreviousPageParam: (firstPage) => firstPage.previousPage ?? undefined,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    });

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    });

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div className="grid.wide">
            <h1>All Course </h1>
            <div className="row"></div>
            {status === 'loading' ? (
                <p>Loading...</p>
            ) : status === 'error' ? (
                <span>Error: {error.message}</span>
            ) : (
                <div className="row">
                    {data?.pages ? (
                        data?.pages.map((page) => (
                            <React.Fragment key={page.nextPage}>
                                {page?.listCourse.map((course) => (
                                    <div className={`${cx('segment')} col l-4`} key={Math.random()}>
                                        <Card item={course} />
                                    </div>
                                ))}
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <h1>not data</h1>
                        </>
                    )}
                    <div>
                        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                ? 'Load Newer'
                                : 'Nothing more to load'}
                        </button>
                    </div>
                    <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
                </div>
            )}
            <hr />
            <button onClick={(e) => dowloadImage(e, 2)}>kiểm tra cache</button>
        </div>
    );
}

function Card({ item }) {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [url, setUrl] = useState('/course/introduce');
    React.useEffect(() => {
        axiosPrivate
            .get(`/api/course/enrolled/check/${item?.id}`)
            .then((res) => {
                console.log('hahahahah');
                if (res.data === true) setUrl('/course/enrolled');
            })
            .catch((error) => console.log(error));
    }, []);
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
            <p className={cx('card-body')}>{item.shortDescription}</p>
            <p className={cx('footer')}>
                Written by <span className={cx('by-name')}>John Doe</span> on{' '}
                <span className={cx('date')}>25/05/23</span>
            </p>
        </div>
    );
}
