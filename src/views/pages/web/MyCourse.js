import { useEffect } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function MyCourse() {
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        //console.log(localStorage.getItem('AccessToken'));
        axiosPrivate
            .get('/api/courses', {
                headers: { Authorization: localStorage.getItem('AccessToken') },
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    return (
        <>
            <h1>My Course</h1>
        </>
    );
}
export default MyCourse;
