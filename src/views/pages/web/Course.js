import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import styles from './scss/Course.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'src/views/image/Image';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';

export default function Course() {
    const cx = classNames.bind(styles);
    const axiosPrivate = useAxiosPrivate();
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['projects'],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axiosPrivate.get('/api/courses/list', { params: { page: pageParam, rowsPerPage: 6 } });
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        getPreviousPageParam: (firstPage) => (firstPage.first ? undefined : firstPage.number - 1),
        getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    });

    const {
        status: statusRecommend,
        data: dataRecommend,
        error: errorRecommend,
    } = useQuery({
        queryKey: ['recommendProjects'],
        queryFn: async () => {
            const res = await axiosPrivate.get('/api/courses/rated', { params: { userName: token?.sub } });
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    console.log(dataRecommend);
    return (
        <div className="grid.wide">
            <h1 className="mt-5">Recommend</h1>
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

            <h1 className="mt-5">All Course </h1>
            {status === 'loading' ? (
                <p>Loading...</p>
            ) : status === 'error' ? (
                <span>Error: {error.message}</span>
            ) : (
                <div className="row">
                    {data?.pages ? (
                        data?.pages.map((page) => (
                            <React.Fragment key={page.nextPage}>
                                {page?.content.map((course) => (
                                    <div className={`${cx('segment')} col l-4`} key={uuidv4()}>
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
                    <div className="mt-5 grid justify-items-center">
                        <button
                            className={cx('cta')}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage ? (
                                'Loading more...'
                            ) : hasNextPage ? (
                                <div className="flex">
                                    <span className={cx('hover-underline-animation')}> Load newer </span>
                                    <svg
                                        viewBox="0 0 46 16"
                                        height="10"
                                        width="30"
                                        xmlns="http://www.w3.org/2000/svg"
                                        id="arrow-horizontal"
                                    >
                                        <path
                                            transform="translate(30)"
                                            d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                                            data-name="Path 10"
                                            id="Path_10"
                                        ></path>
                                    </svg>
                                </div>
                            ) : (
                                'Nothing more to load'
                            )}
                        </button>
                    </div>
                    <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
                </div>
            )}
            <hr />
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
                if (res.data === true) setUrl('/course/enrolled');
            })
            .catch((error) => console.log(error));
    }, [item]);
    console.log(url);
    const handleClick = () => {
        navigate(url, { state: { idCourse: item?.id } });
    };
    console.log(item);
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
            <p className={`${cx('footer')} flex`}>
                <p className="mr-5">Price :{item?.price} VND</p>
                <Avatar alt="Remy Sharp" src={item?.avatar || null} />
                Written by <span className={cx('by-name')}>{item?.fullNameTeacher}</span> on{' '}
            </p>
        </div>
    );
}

/* <div>
                        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                ? 'Load Newer'
                                : 'Nothing more to load'}
                        </button>
                    </div> */
