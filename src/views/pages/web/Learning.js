import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ReactPlayer from 'react-player';
import ListItem from '@mui/material/ListItem';
import Comment from 'src/views/comment/comment';
import Comment2 from 'src/views/comment/Comment2';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Disclosure } from '@headlessui/react';
import styles from './scss/Learning.module.scss';
import classNames from 'classnames/bind';
import Button from '@mui/material/Button';
import jwtDecode from 'jwt-decode';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import styles2 from './scss/CourseUpdate.module.scss';
import { v4 as uuidv4 } from 'uuid';
import ReplayIcon from '@mui/icons-material/Replay';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Assistant from './Assistant';
function Learning() {
    const [course, setCourse] = useState();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [fileStart, setFileStart] = useState();
    const [lesson, setLesson] = useState({});
    const navigate = useNavigate();
    const cx = classNames.bind(styles);
    const [studying, setStudying] = useState(location?.state?.idLecture);
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const [point, setPoint] = useState();
    const [learned, setLearned] = useState([]);
    const [exercise, setExercise] = useState({});
    const [openContent, setOpenContent] = useState('');
    console.log(fileStart);
    console.log(learned);
    useEffect(() => {
        axiosPrivate
            .get('/api/course', { params: { id: location?.state?.idCourse } })
            .then((res) => setCourse(res?.data))
            .catch((error) => console.log(error));

        axiosPrivate
            .get('/api/course/processpoint/pointcurrent', {
                params: { idCourse: location?.state?.idCourse, userName: token?.sub },
            })
            .then((res) => {
                console.log(res?.data);
                setStudying(res?.data?.studying);
                setPoint(res?.data?.point);
                setLearned([...res?.data?.learned]);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        axiosPrivate
            .get(`/api/course/lecture/get/${studying}`)
            .then((res) => {
                setLesson(res?.data);
                if (res?.data && res?.data?.files.length > 0) {
                    setOpenContent('Video');
                }
            })
            .catch((error) => console.log(error));

        axiosPrivate
            .get('/api/course/lecture/file/getstart', { params: { idLecture: studying } })
            .then((res) => setFileStart(res?.data))
            .catch((er) => console.log(er));
    }, [studying]);

    const handleClick = (e, file, lecture) => {
        e.stopPropagation();
        setFileStart(file);
        setLesson(lecture);
        setOpenContent('Video');
        console.log('daclick');
    };
    const handleClickBack = () => {
        navigate(-1);
    };
    const handleClickNext = () => {
        axiosPrivate
            .get('/api/course/processpoint/next', {
                params: { idCourse: location?.state?.idCourse, userName: token?.sub },
            })
            .then((res) => {
                setStudying(res?.data?.studying);
                setPoint(res?.data?.point);
                setLearned([...res?.data?.learned]);
            })
            .catch((error) => console.log(error));
    };

    const handleClickExercise = (e, lecture) => {
        e.stopPropagation();
        setOpenContent('Exercise');
        setExercise(lecture);
    };

    console.log('learned ', learned);
    console.log('studying', studying);
    return (
        <>
            <Disclosure as="nav" className={cx('wrapper-header')}>
                <>
                    <div className={`w-full px-2 sm:px-6 lg:px-8 relative`}>
                        <div className="flex h-16 absolute left-2 px-3 mx-3">
                            <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Button onClick={handleClickBack}>
                                    <KeyboardArrowLeftIcon style={{ color: 'white' }} fontSize="large" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex h-16 absolute right-2 px-3 mx-3">
                            <div className="inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <button
                                    onClick={handleClickNext}
                                    className="cursor-pointer px-8 py-1 bg-red-500 bg-opacity-80 text-[#f1f1f1] hover:bg-opacity-90 transition font-semibold shadow-md h-10"
                                >
                                    <KeyboardDoubleArrowRightIcon />
                                    Next Lesson
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            </Disclosure>

            <div className="grid">
                <div className="row">
                    <div className="col l-3  h-screen overflow-y-auto">
                        <List
                            sx={{
                                width: '100%',
                                bgcolor: 'background.paper',
                                position: 'relative',
                                overflow: 'auto',
                                maxHeight: '100%',
                                '& ul': { padding: 0 },
                            }}
                            subheader={<li />}
                        >
                            {course?.thematics &&
                                course?.thematics.map((thematic, idx) => (
                                    <li key={`section-${idx}`}>
                                        <ul>
                                            <ListSubheader
                                                color="primary"
                                                sx={{ lineHeight: 1.5, fontSize: 20, margin: '20px 0px' }}
                                            >{`Thematic ${idx + 1}: ${thematic?.name}`}</ListSubheader>
                                            {thematic?.lectures &&
                                                thematic?.lectures.map((lecture, idxl) => (
                                                    <li key={`${lecture.title}${idx}${idxl}`}>
                                                        <ul>
                                                            <ListSubheader
                                                                sx={{
                                                                    lineHeight: 1.5,
                                                                    fontSize: 18,
                                                                    textIndent: 10,
                                                                    color: 'black',
                                                                }}
                                                            >{`Lesson ${idx + 1}: ${lecture?.title}`}</ListSubheader>
                                                            {lecture?.files &&
                                                                lecture?.files.map((file, idxf) => (
                                                                    <ListItemButton
                                                                        key={`${file.fileName}${idx}${idxl}${idxf}`}
                                                                        onClick={(e) => handleClick(e, file, lecture)}
                                                                    >
                                                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                                                            {fileStart && fileStart?.id === file?.id ? (
                                                                                <RadioButtonCheckedIcon
                                                                                    style={{
                                                                                        color: '#f6365c',
                                                                                    }}
                                                                                />
                                                                            ) : learned &&
                                                                              learned.includes(lecture?.id) ? (
                                                                                <CheckCircleIcon
                                                                                    style={{
                                                                                        color: '#f6365c',
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <RadioButtonUncheckedIcon
                                                                                    style={{
                                                                                        color: '#f6365c',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </ListItemIcon>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <OndemandVideoIcon
                                                                                    style={{
                                                                                        color: '#f6365c',
                                                                                    }}
                                                                                />
                                                                            </ListItemIcon>
                                                                            <ListItemText
                                                                                primary={`${file?.fileName}`}
                                                                            />
                                                                        </ListItem>
                                                                    </ListItemButton>
                                                                ))}
                                                            {lecture?.exercises && lecture?.exercises.length > 0 && (
                                                                <ListItemButton
                                                                    onClick={(e) => handleClickExercise(e, lecture)}
                                                                >
                                                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                                                        <NoteAltIcon
                                                                            style={{
                                                                                color: '#f6365c',
                                                                            }}
                                                                        />
                                                                    </ListItemIcon>
                                                                    <ListItem>
                                                                        <ListItemText primary="Short Exercise" />
                                                                    </ListItem>
                                                                </ListItemButton>
                                                            )}
                                                        </ul>
                                                    </li>
                                                ))}
                                        </ul>
                                    </li>
                                ))}
                        </List>
                    </div>
                    <div className="col l-9  h-screen overflow-y-auto">
                        {openContent && openContent === 'Video' ? (
                            <ContentLesson file={fileStart} lesson={lesson} />
                        ) : (
                            <ContentExercise lecture={exercise} />
                        )}
                        <Assistant idCourse={location?.state?.idCourse} />
                    </div>
                </div>
            </div>
        </>
    );
}

const ContentLesson = ({ file, lesson }) => {
    const axiosPrivate = useAxiosPrivate();
    const [videoOfLesson, setVideoOfLesson] = useState();
    console.log('rerender');
    useEffect(() => {
        axiosPrivate
            .get('/api/course/lecture/file/download', {
                params: { idLecture: lesson?.id, link: file?.fileLink },
            })
            .then((res) => {
                console.log('daload');
                setVideoOfLesson(res?.data);
            })
            .catch((error) => console.log(error));
    }, [file]);
    return (
        <div className="w-full">
            <div className="flex mb-3 mt-5">
                <OndemandVideoIcon fontSize="large" />
                <p className="ml-5 text-2xl font-sans text-black">Name Lesson</p>
            </div>
            <div className="flex justify-center items-center h-full mb-5">
                <ReactPlayer url={videoOfLesson} playing controls width="90%" height="auto" />
            </div>
            <div className="mb-3">
                <p className="text-2xl font-sans text-black">Content Lesson</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: lesson?.content }} className="mb-3" />
            <div className="w-full">
                <Comment2 lessonId={lesson?.id} />
            </div>
        </div>
    );
};

const ContentExercise = ({ lecture }) => {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles2);
    const [listExercise, setListExercise] = useState([]);
    const [submit, setSubmit] = useState([]);
    const [exercisesNoAnswer, setExercisesNoAnswer] = useState([]);
    const [statusSubmit, setStatusSubmit] = useState(false);
    const modalSubmit = {
        idQuestion: '',
        choice: [],
    };

    useEffect(() => {
        setSubmit([]);
        axiosPrivate
            .get(`/api/course/lecture/${lecture?.id}/exercises/get`)
            .then((res) => {
                let temp = res?.data;
                res?.data.forEach((item, idx) => {
                    item?.choice.forEach((choice, idxC) => {
                        if (choice?.right === true) {
                            temp[idx].choice[idxC].isWrong = false;
                        } else {
                            temp[idx].choice[idxC].isWrong = true;
                        }
                    });
                });
                setListExercise([...temp]);
            })
            .catch((error) => console.log(error));

        axiosPrivate
            .get(`/api/course/lecture/${lecture?.id}/exercises/noanswer/get`)
            .then((res) => {
                const exercises = res?.data.map((exercise) => ({ ...exercise, messageError: '' }));
                setExercisesNoAnswer(exercises);
            })
            .catch((error) => console.log(error));
    }, [lecture]);

    const handleChange = (e, type, idxEx, idxCh, idQuestion, idChoice) => {
        if (statusSubmit) {
            return;
        }
        e.stopPropagation();
        let temp = [...exercisesNoAnswer];
        let submitTemp = {
            idQuestion: idxEx,
            choice: [],
        };
        if (type === 'ONE_CHOICE') {
            const indexOfOld = temp[idxEx]?.choice.findIndex((choice) => choice?.right === true);
            if (idxCh === indexOfOld) {
                return;
            }
            if (indexOfOld === -1) {
                temp[idxEx].choice[idxCh].right = true;
            }
            if (indexOfOld !== -1) {
                temp[idxEx].choice[indexOfOld].right = false;
                temp[idxEx].choice[idxCh].right = true;
            }

            submitTemp.choice = [idxCh];
        }
        if (type === 'MULTI_CHOICE') {
            let choiceTemp = [];
            if (temp[idxEx].choice[idxCh].right === true) {
                temp[idxEx].choice[idxCh].right = false;
            } else {
                temp[idxEx].choice[idxCh].right = true;
            }

            temp[idxEx]?.choice.forEach((item, idx) => {
                if (item?.right === true) choiceTemp.push(idx);
            });
            submitTemp.choice = [...choiceTemp];
        }
        setExercisesNoAnswer([...temp]);

        const index = submit.findIndex((item) => item?.idQuestion == idxEx);
        if (index === -1) {
            setSubmit([...submit, submitTemp]);
        } else {
            let temp = [...submit];
            if (submitTemp?.choice.length === 0) {
                temp = submit.filter((item) => item?.idQuestion !== submitTemp?.idQuestion);
            } else {
                temp[index] = submitTemp;
            }

            setSubmit([...temp]);
        }
    };

    const handleClickSubmit = (e) => {
        e.stopPropagation();

        console.log(exercisesNoAnswer);
        if (submit?.length == 0) {
            console.log('Qua dk 1');
            let temp = [...exercisesNoAnswer];
            exercisesNoAnswer.forEach((item, idx) => {
                temp[idx] = { ...item, messageError: `Please complete the question` };
            });
            setExercisesNoAnswer([...temp]);
            return;
        }

        if (submit?.length > 0 && submit?.length < exercisesNoAnswer?.length) {
            console.log('Qua dk 2');
            let temp = [...exercisesNoAnswer];
            exercisesNoAnswer.forEach((item, idx) => {
                console.log(item?.messageError);
                let index = submit.findIndex((sub) => sub?.idQuestion === idx);
                if (index === -1) {
                    console.log('đã thiếu câu', idx);
                    temp[idx].messageError = `Please complete the question`;
                } else {
                    temp[idx].messageError = '';
                }
            });
            console.log(temp);
            setExercisesNoAnswer([...temp]);
            return;
        }

        if (submit.length > 0 && submit.length === exercisesNoAnswer.length) {
            console.log('Qua dk 3');
            console.log(exercisesNoAnswer);
            let error = 0;
            let temp = [...exercisesNoAnswer];
            submit.forEach((item) => {
                if (item?.choice.length === 0) {
                    temp[item?.idQuestion].messageError = `Please complete the question`;
                    error++;
                } else {
                    temp[item?.idQuestion].messageError = '';
                }
            });
            setExercisesNoAnswer([...temp]);
            if (error > 0) return;
        }
        console.log(exercisesNoAnswer);

        let answerTemp = [...exercisesNoAnswer];
        submit.forEach((item) => {
            let correctChoice = 0;
            let totalCorrectChoice = 0;
            listExercise[item?.idQuestion]?.choice.forEach((choice) => {
                if (choice?.right == true) {
                    totalCorrectChoice++;
                }
            });
            item?.choice.forEach((choice) => {
                if (listExercise[item?.idQuestion].choice[choice].right === true) {
                    answerTemp[item?.idQuestion].choice[choice].isWrong = false;
                    correctChoice++;
                } else {
                    answerTemp[item?.idQuestion].choice[choice].isWrong = true;
                }
            });
            let scores = (correctChoice * 100) / totalCorrectChoice;
            answerTemp[item?.idQuestion].scores = scores.toFixed();
        });
        setExercisesNoAnswer([...answerTemp]);

        setStatusSubmit(true);
    };

    const handleRetry = (e) => {
        e.stopPropagation();
        setStatusSubmit(false);
        setSubmit([]);
        axiosPrivate
            .get(`/api/course/lecture/${lecture?.id}/exercises/noanswer/get`)
            .then((res) => {
                const exercises = res?.data.map((exercise) => ({ ...exercise, messageError: '' }));
                setExercisesNoAnswer(exercises);
            })
            .catch((error) => console.log(error));
    };

    console.log(listExercise);

    return (
        <div className="grid">
            <div className="row">
                <div className="col l-9 h-screen overflow-y-auto">
                    <div className="flex flex-row justify-between mt-5 items-center">
                        <p className="relative text-5xl  font-semibold whitespace-nowrap truncate overflow-hidden">
                            Text in a modal
                        </p>
                        <Tooltip title="Retry">
                            <button className="mr-5" onClick={(e) => handleRetry(e)}>
                                <ReplayIcon fontSize="large" />
                            </button>
                        </Tooltip>
                    </div>
                    <ul>
                        {exercisesNoAnswer &&
                            exercisesNoAnswer.length > 0 &&
                            exercisesNoAnswer.map((exercise, idx) => (
                                <li className="mb-20" key={uuidv4()}>
                                    <div>
                                        <p className="mb-20 mt-5 text-3xl font-sans text-black">{exercise?.question}</p>
                                        <p className="mt-5 mb-3 text-2xl font-sans text-black">
                                            Choices :{' '}
                                            <p className="text-base font-sans text-black">
                                                {exercise?.type && exercise?.type === 'ONE_CHOICE'
                                                    ? '( This is a one-answer question )'
                                                    : '( This is a question with many answers )'}
                                            </p>
                                        </p>

                                        {exercise?.messageError && (
                                            <p
                                                key={uuidv4()}
                                                className="mb-5 text-base font-sans text-red-500"
                                            >{`( * ${exercise?.messageError}.)`}</p>
                                        )}
                                        <ul>
                                            {exercise?.choice &&
                                                exercise?.choice.length > 0 &&
                                                exercise?.choice.map((choice, idxC) => (
                                                    <li className="flex mb-4 w-9/12 ml-10" key={uuidv4()}>
                                                        <div>
                                                            <input
                                                                id={`choice${choice?.id}`}
                                                                className={cx('checkbox', { wrong: choice?.isWrong })}
                                                                type="checkbox"
                                                                tabIndex={-1}
                                                                checked={choice?.right}
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        e,
                                                                        exercise?.type,
                                                                        idx,
                                                                        idxC,
                                                                        exercise?.id,
                                                                        choice?.id,
                                                                    )
                                                                }
                                                            ></input>
                                                        </div>
                                                        <p
                                                            className="ml-5 text-xl font-sans text-black "
                                                            style={{ overflow: 'auto', wordWrap: 'break-word' }}
                                                        >
                                                            {choice?.content}
                                                        </p>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    {idx < exercisesNoAnswer.length - 1 && (
                                        <Divider variant="middle" sx={{ borderWidth: '2px', borderColor: 'black' }} />
                                    )}
                                </li>
                            ))}
                    </ul>
                    <button
                        onClick={(e) => handleClickSubmit(e)}
                        className="bg-emerald-200 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-full shadow-lg shadow-neutral-950 hover:text-white transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
                    >
                        Submit
                    </button>
                </div>
                <div className="col l-3 ">
                    <div className={cx('card')}>
                        <div className={cx('header')}>Scores</div>
                        <div className={cx('body')}>
                            {exercisesNoAnswer &&
                                exercisesNoAnswer.length > 0 &&
                                exercisesNoAnswer.map((exercise, idx) => (
                                    <div className={cx('skill')} key={uuidv4()}>
                                        <div className={cx('skill-name')}>{`Question ${idx + 1}`}</div>
                                        <div className={cx('skill-level')}>
                                            <div
                                                className={cx('skill-percent')}
                                                style={{ width: `${exercise?.scores || 0}%` }}
                                            ></div>
                                        </div>
                                        <div className={cx('skill-percent-number')}>{`${exercise?.scores || 0}%`}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learning;
