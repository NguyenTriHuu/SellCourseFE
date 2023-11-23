import { memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
const Image = ({ id, queryKey, url }) => {
    useEffect(() => {}, []);
    const { data, status } = useQuery({
        queryKey: [queryKey, id],
        queryFn: () =>
            fetch(url, {
                headers: {
                    Authorization: `${localStorage.getItem('AccessToken')}`,
                },
            }).then((response) => response.blob()),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

    console.log(id);
    console.log(queryKey);
    console.log(url);
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error loading image</div>;
    }
    // console.log(URL.createObjectURL(data));

    return (
        <>
            <img
                alt="description"
                src={data ? URL.createObjectURL(data) : null}
                style={{ height: '100%', width: '100%', display: 'block', margin: 'auto', objectFit: 'cover' }}
            />
        </>
    );
};

export default memo(Image);
