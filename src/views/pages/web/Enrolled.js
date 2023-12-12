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
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function EnRolled() {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles);
    const location = useLocation();
    //location?.state?.idCourse
    const [data, setData] = useState();
    const [open, setOpen] = useState('instructor');
    const [openModal, setOpenModal] = useState(false);
    const [valueRating, setValueRating] = useState();
    const accessToken = localStorage.getItem('AccessToken');
    const [rating, setRating] = useState();
    const [openModalMessage, setOpenModalMessage] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    useEffect(() => {
        axiosPrivate
            .get(`/api/course/enrolled/${location?.state?.idCourse}`)
            .then((res) => setData(res.data))
            .catch((error) => console.log(error));
    }, []);
    console.log(data);

    useEffect(() => {
        axiosPrivate
            .get(`/api/rating/course/${location?.state?.idCourse}/get`, {
                params: { userName: jwtDecode(accessToken)?.sub },
            })
            .then((res) => setRating(res?.data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        setValueRating(rating?.rating);
    }, [rating]);

    const handleCloseModal = (e) => {
        e.stopPropagation();
        setOpenModal(false);
    };

    const handleRating = (e) => {
        e.stopPropagation();
        let ratingRequest = {
            userName: jwtDecode(accessToken)?.sub,
            idCourse: location?.state?.idCourse,
            rating: valueRating,
            idRating: rating?.idRating,
        };

        axiosPrivate
            .post('/api/rating/save', ratingRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                setRating(res?.data);
                setOpenModal(false);
                setOpenModalSuccess(true);
            })
            .catch((error) => {
                console.log(error);
                setOpenModalMessage(true);
            });
    };

    const handleCloseModalMessage = (e) => {
        e.stopPropagation();
        setOpenModalMessage(false);
    };

    const handleCloseModalSuccess = (e) => {
        e.stopPropagation();
        setOpenModalSuccess(false);
    };
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
                            <BorderLinearProgress variant="determinate" value={data?.point} />
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
                                        <ListItemText primary="Danh sách bài học" />
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
                                        <ListItemText primary="Instructor của bạn" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem>
                                    <ListItemButton
                                        onClick={(e) => {
                                            e.stopPropagation;
                                            setOpenModal(true);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <PersonOutlineIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Đánh giá" />
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
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className=" grid justify-items-center">
                                <p className="text-2xl font-sans tracking-widest">Đánh giá </p>
                                <p className="text-xl font-sans tracking-widest">
                                    Bạn nghĩ như nào về khóa học hiện tại
                                </p>
                                <Rating
                                    name="size-large"
                                    value={valueRating || 0}
                                    size="large"
                                    onChange={(event, newValue) => {
                                        event.stopPropagation();
                                        setValueRating(newValue);
                                    }}
                                />
                            </div>
                            <div className="mt-5 flex grid justify_items-end">
                                <Button variant="contained" sx={{ marginBottom: '8px' }} onClick={handleRating}>
                                    Đánh giá
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenModal(false);
                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </Box>
                    </Modal>

                    <Modal
                        open={openModalMessage}
                        onClose={handleCloseModalMessage}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className=" grid justify-items-center">
                                <div className="flex mb-2">
                                    <ErrorIcon sx={{ color: 'red' }} />
                                    <p className="ml-2 text-2xl font-sans tracking-widest">Lỗi hệ thống </p>
                                </div>

                                <p className="text-base font-sans tracking-widest">
                                    Hiện hệ thống đang gặp vấn đề hãy thử lại sau.
                                </p>
                            </div>
                            <div className="mt-5 flex grid justify_items-end">
                                <Button
                                    variant="contained"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenModalMessage(false);
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </Box>
                    </Modal>

                    <Modal
                        open={openModalSuccess}
                        onClose={handleCloseModalSuccess}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className=" grid justify-items-center">
                                <div className="flex mb-2">
                                    <CheckCircleIcon sx={{ color: 'green' }} />
                                    <p className="ml-2 text-2xl font-sans tracking-widest">Đánh giá thành công </p>
                                </div>

                                <p className="text-base font-sans tracking-widest">
                                    Bạn đã đánh giá khóa học thành công.
                                </p>
                            </div>
                            <div className="mt-5 flex grid justify_items-end">
                                <Button
                                    variant="contained"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenModalSuccess(false);
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </Box>
                    </Modal>
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
