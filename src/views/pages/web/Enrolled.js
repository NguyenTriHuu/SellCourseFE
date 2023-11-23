import Image from 'src/views/image/Image';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import styles from './scss/Enrolled.module.scss';
import classNames from 'classnames/bind';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import CardHeader from '@mui/material/CardHeader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
const cx = classNames.bind(styles);

function EnRolled() {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles);
    const location = useLocation();
    //location?.state?.idCourse
    const [data, setData] = useState();
    const [open, setOpen] = useState('instructor');

    useEffect(() => {
        axiosPrivate
            .get(`/api/course/enrolled/${location?.state?.idCourse}`)
            .then((res) => setData(res.data))
            .catch((error) => console.log(error));
    }, []);
    console.log(data);
    return (
        <>
            <div className="grid">
                <div className="row">
                    <div className="col l-3">
                        <div className="w-full h-60">
                            <Image
                                id={1}
                                url={`http://localhost:8080/api/course/thumdnail/${location?.state?.idCourse}/download`}
                                queryKey="thumbnail"
                            />
                        </div>
                        <div className="my-4 ml-5">
                            <p className="text-lg font-sans tracking-widest text-center">{data?.course?.title}</p>
                        </div>
                        <div className="my-4 ml-5">
                            <BorderLinearProgress variant="determinate" value={50} />
                        </div>
                        <div className="mx-auto mb-5">
                            <p className="text-xl font-sans tracking-widest text-center">{data?.point}% COMPLETE</p>
                        </div>
                        <Divider sx={{ borderTop: '1px solid #181819f2' }} />
                        <div className="mx-2 mt-5">
                            <List>
                                <ListItem>
                                    <ListItemButton
                                        onClick={(e) => {
                                            e.stopPropagation;
                                            setOpen('instructor');
                                        }}
                                    >
                                        <ListItemIcon>
                                            <ListAltIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Course Curriculum" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton
                                        onClick={(e) => {
                                            e.stopPropagation;
                                            setOpen('curriculum');
                                        }}
                                    >
                                        <ListItemIcon>
                                            <PersonOutlineIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Your Instructor" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </div>
                    </div>
                    <div className="col l-9 max-h-max">
                        <div hidden={open === 'curriculum'} className="mr-10">
                            <Curriculum data={data?.course} />
                        </div>
                        <div hidden={open === 'instructor'}>
                            <Instructor idCourse={data?.course?.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const Curriculum = ({ data }) => {
    const [open, setOpen] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    console.log(data);
    const handleOpen = (e, newVal) => {
        e.stopPropagation();
        if (open.includes(newVal)) {
            const temp = open.filter((val) => val !== newVal);
            setOpen([...temp]);
        } else {
            setOpen([...open, newVal]);
        }
    };

    const handleClickStart = (event, id) => {
        event.stopPropagation();
        navigate('/learning', { state: { idCourse: location?.state?.idCourse, idLecture: id } });
    };
    return (
        <>
            <div className="grid ">
                <div className="w-full ml-5 mt-5 mb-5">
                    <h2 className="text-3xl font-sans tracking-widest">Course Curriculum</h2>
                </div>
                <div>
                    <button className={cx('button', 'learn-more')}>
                        <span className={cx('circle')} aria-hidden="true">
                            <span className={cx('icon', 'arrow')}></span>
                        </span>
                        <span className={`${cx('button-text')} font-sans`}>Start next lesson</span>
                    </button>
                    <p className="text-base font-sans tracking-widest mt-1 ml-14"> tên file</p>
                </div>
                <div className="my-4 ml-5">
                    <h2 className="text-lg font-sans tracking-widest">{data?.title}</h2>
                </div>
                {data?.thematics.map((thematic, idx) => (
                    <Card
                        sx={{
                            minWidth: 300,
                            border: '1px solid rgba(211,211,211,0.6)',
                        }}
                        key={`${thematic?.name}${idx}`}
                    >
                        <CardHeader
                            title={`Chapter ${idx + 1}: ${thematic?.name}`}
                            action={
                                <IconButton
                                    onClick={(e) => handleOpen(e, `${thematic?.name}${idx}`)}
                                    aria-label="expand"
                                    size="small"
                                >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            }
                        ></CardHeader>
                        <div
                            style={{
                                backgroundColor: '#f1f6f7',
                            }}
                        >
                            <Collapse in={open.includes(`${thematic?.name}${idx}`)} timeout="auto" unmountOnExit>
                                <List>
                                    {thematic?.lectures.map((lecture, idxl) => (
                                        <ListItemButton
                                            key={`${lecture?.title}${idx}${idxl}`}
                                            onClick={(e) => handleClickStart(e, lecture?.id)}
                                        >
                                            <ListItemIcon sx={{ minWidth: 30 }}>
                                                <RemoveCircleIcon
                                                    style={{
                                                        color: '#f6365c',
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <OndemandVideoIcon
                                                        style={{
                                                            color: '#f6365c',
                                                        }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={`${lecture?.title}`} />
                                            </ListItem>

                                            <ListItemIcon>
                                                <PlayCircleFilledWhiteIcon
                                                    style={{
                                                        marginLeft: 35,
                                                        color: '#f6365c',
                                                    }}
                                                />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};
const Instructor = ({ idCourse }) => {
    const axiosPrivate = useAxiosPrivate();
    const [profile, setProfile] = useState();
    useEffect(() => {
        axiosPrivate
            .get(`/api/user/teacher/course/${idCourse}`)
            .then((res) => setProfile(res?.data))
            .catch((e) => console.log(e));
    }, [idCourse]);

    return (
        <>
            <div className="grid mt-20">
                <div className="row">
                    <div className="col l-3">
                        <div className="w-40 h-40 rounded-full border-teal-200 border-2">
                            <Image
                                queryKey={`avatar`}
                                id={profile?.id}
                                url={`http://localhost:8080/api/user/teacher/course/${profile?.id}/avatar`}
                            />
                        </div>
                    </div>
                    <div className="col l-9">
                        <p>about me</p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default EnRolled;
