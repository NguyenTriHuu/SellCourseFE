import { useLocation, useNavigate } from 'react-router-dom';
import styles from './scss/Introduction.module.scss';
import classNames from 'classnames/bind';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import VideoPlayer from 'src/views/video/video';
import { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import Profile from 'src/views/profiles/profile';
function Introduction() {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles);
    const location = useLocation();
    const [data, setData] = useState();
    const [urlPay, setUrlPay] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        axiosPrivate
            .get('/api/course', { params: { id: location?.state?.idCourse } })
            .then((res) => setData(res.data))
            .catch((e) => console.log(e));

        axiosPrivate
            .post(
                '/api/pay',
                new URLSearchParams({
                    amount: 10000,
                    bankCode: 'NCB',
                    language: 'vn',
                    idCourse: `${location?.state?.idCourse}`,
                }),
            )
            .then((res) => setUrlPay(res?.data?.url))
            .catch((e) => console.log(e));
    }, []);
    console.log(data);

    const handleBuyCourse = () => {
        window.open(`${urlPay}`);
    };

    return (
        <>
            <div className="bg-[#50c9c3] h-auto min-h-fit">
                <div className="grid wide justify-items-center">
                    <div className="mx auto mt-20 mb-3 ">
                        <h1 className=" text-5xl font-sans line-clamp-2 tracking-wider text-white text-center">
                            {data?.title}
                        </h1>
                    </div>
                    <div className="mx auto mb-3 w-2/3">
                        <div
                            className="text-4xl font-sans tracking-wide text-white line-clamp-none text-center leading-normal"
                            dangerouslySetInnerHTML={{ __html: data?.shortDescription }}
                        />
                    </div>
                    <button className={`${cx('button')} my-5`}>Buy Course</button>
                </div>
            </div>

            <div className="h-auto min-h-fit bg-slate-100">
                <div className="grid wide justify-items-center">
                    <div className="mx auto mt-20 mb-3 ">
                        <h1 className="text-4xl font-sans tracking-wide text-black">Tên khóa học llll</h1>
                    </div>

                    <div className="mx auto mb-3 ">
                        <p className="text-2xl font-sans text-black">Thời lượng khóa học lll</p>
                    </div>

                    <div className="mx auto mb-3 ">
                        <VideoPlayer id="videoShort" idCourse={data?.id} />
                    </div>
                </div>
            </div>

            <div className="h-auto min-h-fit bg-white">
                <div className="grid wide">
                    <div className="row">
                        <div className="col l-8">
                            <div className="mx auto mt-3 mb-3 ">
                                <p className="text-4xl font-sans tracking-widest ">Hi there !!</p>
                            </div>
                            <div
                                className="text-1xl font-sans tracking-wide line-clamp-none leading-normal"
                                dangerouslySetInnerHTML={{ __html: data?.description }}
                            />
                        </div>
                        <div className="col l-4">
                            <div className="mx auto mt-3 mb-3 ">
                                <p className="text-4xl font-sans tracking-widest ">Key Features </p>
                            </div>
                            <Divider sx={{ borderTop: '6px solid #51CAC4' }} />
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <TrendingUpOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mất gốc cho tới chuyên sâu" className="text-2xl font-sans" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <AccessAlarmsOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Thời hạn ${data?.duration}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <RotateRightOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Cập nhật liên tục" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <AutoStoriesOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Hơn 1000 bài tập" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <VideoFileOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Hơn 300 bài giảng video" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <FileCopyOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Hơn 300 bài học" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MarkUnreadChatAltOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Hỏi đáp trực tiếp nhanh chóng" />
                                </ListItem>
                            </List>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-auto min-h-fit bg-slate-100">
                <div className="grid wide justify-items-center">
                    <div className="mx auto mt-20 mb-3 ">
                        <h1 className="text-4xl font-sans tracking-wide text-black">Course Curriculum</h1>
                    </div>
                    <div className="w-full h-auto min-h-fit">
                        <List>
                            {data?.thematics &&
                                data?.thematics.map((thematic, idx) => (
                                    <div key={idx}>
                                        <ListItem
                                            sx={{ height: 40, marginBottom: 0.5, marginTop: 2 }}
                                            disablePadding
                                            className="w-full items-center bg-zinc-400"
                                        >
                                            <ListItemText>
                                                <p className="ml-5 text-2xl font-sans tracking-wide text-black">{`Chương ${
                                                    idx + 1
                                                }: ${thematic?.name}`}</p>
                                            </ListItemText>
                                        </ListItem>
                                        {thematic?.lectures &&
                                            thematic?.lectures.map((lectures, idxLec) => (
                                                <ListItem
                                                    sx={{ height: 35, paddingLeft: 3 }}
                                                    disablePadding
                                                    className="w-full items-center bg-zinc-200"
                                                    key={`${lectures.title} ${idx}`}
                                                >
                                                    <ListItemIcon>
                                                        <VideoFileOutlinedIcon />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <p className="text-xl font-sans tracking-wide text-black">{`Bài ${
                                                            idxLec + 1
                                                        }: ${lectures?.title}`}</p>
                                                    </ListItemText>
                                                </ListItem>
                                            ))}
                                    </div>
                                ))}
                        </List>
                    </div>
                </div>
            </div>

            <div className="h-auto min-h-fit bg-white">
                <div className="grid wide justify-items-center">
                    <div className="mx auto mt-20 mb-3 ">
                        <h1 className="text-4xl font-sans tracking-wide text-black">Taught By</h1>
                    </div>
                    <Profile idCourse={data?.id} />
                </div>
            </div>
            <div className="h-auto min-h-fit bg-slate-100">
                <div className="grid wide justify-items-center">
                    <div className="mx-auto mt-20 mb-3">
                        <h1 className="text-4xl font-sans tracking-wide text-black"> Get started now!</h1>
                    </div>
                    <button className={`${cx('button')} my-5`} onClick={handleBuyCourse} hidden={urlPay === null}>
                        Buy Course
                    </button>
                </div>
            </div>
        </>
    );
}

export default Introduction;

/*const { data, status } = useQuery({
        queryKey: ['course_pro', location?.state?.idCourse],
        queryFn: () =>
            axiosPrivate
                .get('http://localhost:8080/api/course', { params: { id: location?.state?.idCourse } })
                .then((res) => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        console.error(status);
        return <div>Error System </div>;
    }*/
