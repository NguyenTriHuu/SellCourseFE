import { memo, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery, useQueryClient } from '@tanstack/react-query';
function ImagePerson({ id }) {
    const queryClient = useQueryClient();
    //console.log(id);
    useEffect(() => {}, []);
    const { data, status } = useQuery({
        queryKey: ['thumbnail', id],
        queryFn: () =>
            fetch(`http://localhost:8080/api/course/thumdnail/${id}/download`, {
                headers: {
                    Authorization: `${localStorage.getItem('AccessToken')}`,
                },
            }).then((response) => response.blob()),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        console.error(status);
        return <div>Error loading image</div>;
    }
    if (status === 'success') {
        const cachedData = queryClient.getQueryData(['course', id]);
        console.log(`Cached data: Image ${id} `, cachedData);
    }
    console.log(data);
    return (
        <img
            alt="description"
            src={data ? URL.createObjectURL(data) : null}
            style={{ height: '100%', width: '100%', display: 'block', margin: 'auto', objectFit: 'cover' }}
        />
    );
}

export default memo(ImagePerson);
