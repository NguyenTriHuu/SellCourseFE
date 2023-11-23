import ReactPlayer from 'react-player';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useState, useEffect } from 'react';
function VideoPlayer({ id, idCourse }) {
    const [video, setVideo] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        fetchData();
    }, [idCourse]);
    const fetchData = async () => {
        try {
            const res = await axiosPrivate.get(`/api/course/video/${idCourse}/download/url`);
            setVideo(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(video);
    console.log(idCourse);
    return (
        <div>
            <ReactPlayer id={`${id}`} url={video} playing controls />
        </div>
    );
}

export default VideoPlayer;
