import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import CardHeader from '@mui/material/CardHeader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import ReactPlayer from 'react-player';
import styles from './scss/CourseUpdate.module.scss';
import classNames from 'classnames/bind';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Draw from 'src/assets/images/undraw_media_player_re_rdd2.svg';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Backdrop from '@mui/material/Backdrop';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import InputMultiline from 'src/views/textarea/TextArea';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import CommentIcon from '@mui/icons-material/Comment';
import { InputBase } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { v4 as uuidv4 } from 'uuid';
import ClearIcon from '@mui/icons-material/Clear';
import { actions, useStore } from 'src/stores';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
};

function UpdateCourse() {
    const location = useLocation();
    const [data, setData] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [open, setOpen] = useState([]);
    const [lectureSelect, setLectureSelect] = useState({});

    const handleOpen = (e, newVal) => {
        e.stopPropagation();
        if (open.includes(newVal)) {
            const temp = open.filter((val) => val !== newVal);
            setOpen([...temp]);
        } else {
            setOpen([...open, newVal]);
        }
    };
    useEffect(() => {
        axiosPrivate
            .get('/api/course', { params: { id: location?.state?.idCourse } })
            .then((res) => setData(res?.data))
            .catch((error) => console.log(error));
    }, []);

    const handleClick = (e, lecture) => {
        e.stopPropagation();
        setLectureSelect({ ...lecture });
        window.scrollTo(0, 0);
    };

    console.log('render cha');

    return (
        <div className="grid relative">
            <div className="row">
                <div className="col l-3 fixed">
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
                                                key={`${lecture.title}${idx}${idxl}`}
                                                onClick={(e) => handleClick(e, lecture)}
                                            >
                                                <ListItemIcon>
                                                    <LibraryAddIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={lecture.title} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="col l-9 h-[1000px] min-h-full absolute right-0">
                    {lectureSelect && <Features lectureBase={lectureSelect} />}
                </div>
            </div>
        </div>
    );
}

const Features = ({ lectureBase }) => {
    const cx = classNames.bind(styles);
    const [video, setVideo] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [lectureUpdate, setLectureUpdate] = useState([]);
    const [content, setContent] = useState();
    const [configComment, setConfigComment] = useState('BLOCK');
    const [fileItem, setFileItem] = useState([]);
    const [lecture, setLecture] = useState({});
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useStore();
    const [openModal, setOpenModal] = useState(false);
    const [errorMessageQuestion, setErrorMessageQuestion] = useState([]);
    console.log(state?.exercise);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = (e) => {
        e.stopPropagation();
        setOpenModal(false);
    };
    useEffect(() => {
        setLecture({ ...lectureBase });
        if (lectureBase?.files && Object.keys(lectureBase?.files).length > 0) {
            fetchData();
        } else {
            setVideo();
        }
        if (lectureBase?.content) {
            setContent(lectureBase?.content);
        }
        if (lectureBase?.configComment?.config) {
            setConfigComment(lectureBase.configComment.config);
        } else {
            setConfigComment('BLOCK');
        }
        setFileItem([]);
        console.log('xxxxxxxxxxx');
        console.log(configComment);
    }, [lectureBase]);

    const fetchData = async () => {
        try {
            const res = await axiosPrivate.get(`/api/course/lecture/file/list/download`, {
                params: { id: lectureBase?.id },
            });
            setVideo(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    console.log('lectureUpdate', lectureUpdate);
    console.log('lectureUpdate', fileItem);
    const handleSave = async () => {
        let messageError = [];
        setLoading(true);
        let formData = new FormData();
        const data = state?.exercise;
        lectureUpdate &&
            lectureUpdate.forEach((item, index) => {
                if (item?.type === 'delete') {
                    formData.append(`idDeletes`, item?.id);
                } else {
                    if (item?.file) {
                        let file = createFile(item.file, item.fileName);
                        formData.append(`fileUpdates`, file);
                        formData.append(`idsUpdateFile`, item.id);
                    } else {
                        formData.append(`updateName`, item.fileName);
                        formData.append(`idsUpdateName`, item.id);
                    }
                }
            });

        fileItem &&
            fileItem.forEach((item, index) => {
                formData.append('fileAdds', item);
            });
        formData.append('content', content);
        formData.append('configComment', configComment);

        data &&
            data.forEach((item, index) => {
                formData.append(`data[${index}][id]`, item.id);
                if (item?.question.replace(/\s/g, '') === '') {
                    let message = `Question ${index + 1}: Content question cannot null`;
                    messageError.push(message);
                }
                let countChoiceContent = 0;
                let countChoiceRight = 0;
                item.choice.forEach((choice, choiceIndex) => {
                    if (choice?.content.replace(/\s/g, '') !== '') {
                        countChoiceContent++;
                    }
                    if (choice?.right === true) {
                        countChoiceRight++;
                    }
                });

                if (item?.type === 'ONE_CHOICE') {
                    if (countChoiceContent < 2) {
                        let message = `Question ${index + 1}: The number of choices is correct as prescribed`;
                        messageError.push(message);
                    }
                    if (countChoiceRight === 0) {
                        let message = `Question ${index + 1}: The question has no answer`;
                        messageError.push(message);
                    }
                }

                if (item?.type === 'MULTI_CHOICE') {
                    if (countChoiceContent < 3) {
                        let message = `Question ${index + 1}: The number of choices is correct as prescribed`;
                        messageError.push(message);
                    }
                    if (countChoiceRight < 2) {
                        let message = `Question ${index + 1}: The number of answers is not appropriate`;
                        messageError.push(message);
                    }
                }
            });
        if (messageError.length !== 0) {
            setErrorMessageQuestion([...messageError]);
            setLoading(false);
            setOpenModal(true);
        } else {
            try {
                const response = await axiosPrivate.post(`/api/course/lecture/${lectureBase?.id}/file/save`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response);
                axiosPrivate
                    .post(`/api/course/lecture/${lectureBase?.id}/exercise/save`, data, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((res) => {
                        console.log(res);
                        setLoading(false);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    };

    const handleChange = (event) => {
        setConfigComment(event.target.value);
    };

    const handleAddFile = (event) => {
        setFileItem([...fileItem, event.target.files[0]]);
        event.target.value = null;
    };
    const handleAddExercise = () => {};
    const handleChangeFile = (event) => {};

    const createFile = (file, name) => {
        return new File([file], name, { type: file.type });
    };

    const RenderVideoDataBase = ({ file, idx }) => {
        const [tempFileName, setTempFileName] = useState(file?.fileName);
        const handleChangeNameVideoDataBase = (e, idx) => {
            setTempFileName(e.target.value);
        };
        const handleBlur = (idx) => {
            let lectureTemp = { ...lecture };
            const videoOld = video[lectureTemp.files[idx].fileName];
            lectureTemp.files[idx].fileName = tempFileName;
            setVideo((prv) => ({
                ...prv,
                [tempFileName]: videoOld,
            }));
            setLecture(lectureTemp);
            setLectureUpdate((prevFileItem) => {
                let items = [...prevFileItem];
                const index = items.findIndex((item) => item.id === file.id);
                if (index !== -1) {
                    items[index].fileName = tempFileName;
                } else {
                    let fileTemp = {
                        id: file?.id,
                        fileName: tempFileName,
                        file: null,
                        type: 'update',
                    };

                    items.push(fileTemp);
                }
                return items;
            });
        };
        const handleChangeFIleDataBase = (event) => {
            const url = URL.createObjectURL(event.target.files[0]);
            const fileEvent = event.target.files[0];
            setVideo((prevFileItem) => {
                let items = { ...prevFileItem };
                items[file?.fileName] = url;
                return items;
            });
            setLectureUpdate((prevFileItem) => {
                let items = [...prevFileItem];
                const index = items.findIndex((item) => item.id === file.id);
                if (index !== -1) {
                    items[index].file = fileEvent;
                } else {
                    let fileTemp = {
                        id: file?.id,
                        fileName: file?.fileName,
                        file: fileEvent,
                        type: 'update',
                    };

                    items.push(fileTemp);
                }
                return items;
            });
            event.target.value = null;
        };

        const handleCickDeleteFileData = () => {
            setVideo((prevFileItem) => {
                let items = { ...prevFileItem };
                delete items[file?.fileName];
                return items;
            });
            setLectureUpdate((prevFileItem) => {
                let items = [...prevFileItem];
                const index = items.findIndex((item) => item.id === file.id);
                if (index !== -1) {
                    items[index].type = 'delete';
                } else {
                    let fileTemp = {
                        id: file?.id,
                        type: 'delete',
                    };

                    items.push(fileTemp);
                }
                return items;
            });
            setLecture((prv) => {
                let items = { ...prv };
                let files = items?.files.filter((item) => item.id != file.id);
                items.files = [...files];
                return items;
            });
        };
        return (
            <>
                <div className="w-full mt-5">
                    <div className="flex justify-center items-center h-full">
                        {video && <ReactPlayer id={`${file?.id}`} url={video[file?.fileName]} playing controls />}
                    </div>
                </div>

                <div className="mt-2 ml-2">
                    <p className="text-2xl font-sans tracking-wide text-black"> Name Video Lesson</p>
                </div>
                <div className="mt-2 ml-3">
                    <input
                        className={cx('input')}
                        value={tempFileName}
                        onChange={(e) => {
                            handleChangeNameVideoDataBase(e, idx);
                        }}
                        onBlur={() => handleBlur(idx)}
                    />
                </div>
                <label className={`${cx('label')} mr-2 mt-2`}>
                    <input type="file" accept="video/*" required onChange={handleChangeFIleDataBase} />
                    <span>Change video</span>
                </label>
                <label className={`${cx('label')} mr-2 mt-2`}>
                    <button onClick={handleCickDeleteFileData}></button>
                    <span>Delete</span>
                </label>
            </>
        );
    };
    console.log('Lecture Update', lectureUpdate);
    console.log(fileItem);
    const RenderVideoChange = ({ file, idx }) => {
        console.log('file dx ', file);

        const [fileNameTemp, setFileNameTem] = useState(file?.name);
        const url = URL.createObjectURL(file);

        const handleChangeNameVideoCh = (e) => {
            setFileNameTem(e.target.value);
        };
        const handleBlur1 = () => {
            const newFile = createFile(file, fileNameTemp, file.type);
            setFileItem((prevFileItem) => {
                let items = [...prevFileItem];
                items[idx] = newFile;
                return items;
            });
        };
        const handleChangeFileNew = (event) => {
            const newFile = createFile([event.target.files[0]], fileNameTemp);
            setFileItem((prevFileItem) => {
                let items = [...prevFileItem];
                const index = items.findIndex((item) => item.name === file.name);
                if (index !== -1) {
                    items[index] = newFile;
                }
                return items;
            });

            event.target.value = null;
        };
        const handleCickDeleteFileChange = () => {
            const temp = fileItem.filter((item) => item !== file);
            setFileItem([...temp]);
        };
        return (
            <>
                <div className="mt-2 ml-2">
                    <p className="text-2xl font-sans tracking-wide text-black"> Name Video Lesson</p>
                </div>
                <div className="mt-2 ml-3">
                    <input
                        className={cx('input')}
                        value={fileNameTemp}
                        onChange={handleChangeNameVideoCh}
                        onBlur={handleBlur1}
                    />
                </div>
                <label className={`${cx('label')} mr-2 mt-2`}>
                    <input type="file" accept="video/*" required onChange={handleChangeFileNew} />
                    <span>Change video</span>
                </label>
                <label className={`${cx('label')} mr-2 mt-2`}>
                    <button onClick={handleCickDeleteFileChange}></button>
                    <span>Delete</span>
                </label>
            </>
        );
    };

    const handleSetContent = (text) => {
        setContent(text);
    };

    return (
        <div className="grid">
            <div className="row">
                <div className="col l-9 relative">
                    {lecture && lecture?.title && (
                        <p className="my-4 w-full text-3xl font-sans text-black">{lecture?.title}</p>
                    )}
                    <div className="mt-2 mb-2 flex">
                        <label className={`${cx('label')} mr-2`}>
                            <input type="file" accept="video/*" required onChange={handleAddFile} />
                            <span>Add Video</span>
                        </label>
                    </div>
                    {lecture && lecture?.files && Object.keys(lecture?.files).length > 0 && fileItem ? (
                        <>
                            {lecture?.files.map(
                                (file, idx) =>
                                    file?.status === true && (
                                        <div key={`${file?.fileName}${idx}`}>
                                            <RenderVideoDataBase file={file} idx={idx} />
                                        </div>
                                    ),
                            )}
                            {fileItem &&
                                fileItem.map((file, idx) => (
                                    <div key={`${file?.name}${idx}`}>
                                        <div className="w-full mt-5">
                                            <div className="flex justify-center items-center h-full">
                                                {file && (
                                                    <ReactPlayer
                                                        id={`${file}${idx}`}
                                                        url={URL.createObjectURL(file)}
                                                        playing
                                                        controls
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <RenderVideoChange file={file} idx={idx} />
                                    </div>
                                ))}
                        </>
                    ) : lecture && lecture?.files && Object.keys(lecture?.files).length > 0 ? (
                        <>
                            {lecture?.files.map((file, idx) => (
                                <div key={`${file?.fileName}${idx}`}>
                                    <RenderVideoDataBase file={file} idx={idx} />
                                </div>
                            ))}
                        </>
                    ) : fileItem ? (
                        <>
                            {fileItem &&
                                fileItem.map((file, idx) => (
                                    <div key={`${file?.name}${idx}`}>
                                        <div className="w-full mt-5">
                                            <div className="flex justify-center items-center h-full">
                                                {file && (
                                                    <ReactPlayer
                                                        id={`${file}${idx}`}
                                                        url={URL.createObjectURL(file)}
                                                        playing
                                                        controls
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <RenderVideoChange file={file} idx={idx} />
                                    </div>
                                ))}
                        </>
                    ) : (
                        <div>
                            <img className="object-cover w-[640px] h-[360px] " src={Draw} alt="Add new Video" />
                        </div>
                    )}
                    <div className="mt-3">
                        <p className="text-2xl font-sans tracking-wide text-black">Content</p>
                        <Content cont={lecture?.content} onSetContent={handleSetContent} />
                    </div>

                    <div className="mt-5">
                        <p className="text-2xl font-sans tracking-wide text-black">Exercise</p>
                        <ModalChoice lectureBase={lectureBase} />
                        <div className="bg-slate-200 w-full min-h-full mt-2"></div>
                    </div>

                    <div className="mt-3 absolute right-3">
                        <button className={`${cx('button-cancel')} mr-3`}>Cancel</button>
                        <button className={cx('button-save')} onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
                <div className="col l-3">
                    <div>
                        <h1>Bình luận</h1>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={configComment}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="BLOCK" control={<Radio />} label="Turn off comment function" />
                            <FormControlLabel
                                value="PRE-APPROVED"
                                control={<Radio />}
                                label="Comments are allowed and pre-approved"
                            />
                            <FormControlLabel
                                value="APPROVAL"
                                control={<Radio />}
                                label="Allow comments without approval"
                            />
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={style}>
                    <div
                        className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Error
                                </h3>
                                <div className="mt-2">
                                    {errorMessageQuestion &&
                                        errorMessageQuestion.length !== -1 &&
                                        errorMessageQuestion.map((error, idx) => (
                                            <p className="text-sm text-gray-500">{error}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <button
                                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                onClick={(e) => handleCloseModal(e)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const ModalChoice = ({ lectureBase }) => {
    const cx = classNames.bind(styles);
    const [state, dispatch] = useStore();
    const [listExercise, setListExercise] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    console.log(listExercise);
    console.log(state?.exercise);

    useEffect(() => {
        axiosPrivate
            .get(`/api/course/lecture/${lectureBase?.id}/exercises/get`)
            .then((res) => {
                dispatch(actions.setExercise(res?.data));
                setListExercise(res?.data);
            })
            .catch((error) => console.log(error));
    }, [lectureBase]);

    useEffect(() => {
        dispatch(actions.setExercise(listExercise));
    }, [listExercise]);

    const handleClickAddQuestion = () => {
        console.log('handleClickAddQuestion');
        let exercise = {
            id: uuidv4(),
            question: '',
            choice: [],
            solution: '',
            type: 'ONE_CHOICE',
        };
        for (let i = 0; i < 5; i++) {
            let choice = {
                id: uuidv4(),
                content: '',
                right: false,
            };
            exercise.choice = [...exercise?.choice, choice];
        }
        setListExercise([exercise, ...listExercise]);
    };

    console.log(listExercise);
    const handleChangeQuestionContent = (text, idx) => {
        let temp = [...listExercise];
        if (temp.length > idx) {
            temp[idx].question = text;
        }
        setListExercise([...temp]);
    };

    const handleChangeSolutionContent = (text, idx) => {
        let temp = [...listExercise];
        if (temp.length > idx) {
            temp[idx].solution = text;
        }
        setListExercise([...temp]);
    };

    const handleChangeContentChoice = (text, idxEx, idxCh) => {
        let exerciseTemps = [...listExercise];

        if (exerciseTemps.length > idxEx) {
            let choiceTemp = [...exerciseTemps[idxEx].choice];

            if (choiceTemp.length > idxCh) {
                choiceTemp[idxCh].content = text;
            }

            exerciseTemps[idxEx].choice = [...choiceTemp];
        }
        setListExercise([...exerciseTemps]);
    };

    const handleDeleteQuestion = (e, id) => {
        e.stopPropagation();
        let temp = listExercise.filter((item) => item?.id !== id);
        setListExercise([...temp]);
    };

    const handleChangeCheckChoice = (e, type, idxEx, idxCh) => {
        e.stopPropagation();
        let exerciseTemp = [...listExercise];
        if (type === 'ONE_CHOICE') {
            const indexOfOld = exerciseTemp[idxEx]?.choice.findIndex((choice) => choice?.right === true);
            if (idxCh === indexOfOld) {
                return;
            }
            if (indexOfOld === -1) {
                exerciseTemp[idxEx].choice[idxCh].right = true;
            }
            if (indexOfOld !== -1) {
                exerciseTemp[idxEx].choice[indexOfOld].right = false;
                exerciseTemp[idxEx].choice[idxCh].right = true;
            }
        }
        if (type === 'MULTI_CHOICE') {
            let array = [];
            exerciseTemp[idxEx]?.choice.forEach((item, idx) => {
                if (item?.right === true) array.push(idx);
            });
            if (exerciseTemp[idxEx].choice[idxCh].right === true) {
                exerciseTemp[idxEx].choice[idxCh].right = false;
            } else if (array.length === 3) {
                exerciseTemp[idxEx].choice[array[0]].right = false;
                exerciseTemp[idxEx].choice[idxCh].right = true;
            } else {
                exerciseTemp[idxEx].choice[idxCh].right = true;
            }
        }

        setListExercise([...exerciseTemp]);
    };

    const handleChangeTypeQuestion = (e, idxEx) => {
        e.stopPropagation();
        let exerciseTemp = [...listExercise];
        exerciseTemp[idxEx].type = e.target.value;
        exerciseTemp[idxEx]?.choice.forEach((choice) => {
            choice.right = false;
        });
        setListExercise([...exerciseTemp]);
    };
    return (
        <>
            <label className={`${cx('label')} mr-2 mt-2`}>
                <button onClick={handleClickAddQuestion}></button>
                <span>Add Question</span>
            </label>
            {listExercise &&
                listExercise.length !== -1 &&
                listExercise.map((exercise, idxEx) => (
                    <div key={`exercise${exercise?.id}`}>
                        <div className="flex flex-row justify-between mt-5">
                            <p className="relative text-xl font-semibold whitespace-nowrap truncate overflow-hidden">
                                Text in a modal
                            </p>

                            <button
                                className="text-gray-500 text-xl"
                                onClick={(e) => handleDeleteQuestion(e, exercise?.id)}
                            >
                                <ClearIcon />
                            </button>
                        </div>

                        <p className="mt-1 text-xl font-sans tracking-wide">Content Questions</p>
                        <InputMultiline idx={idxEx} data={exercise?.question} onSetText={handleChangeQuestionContent} />
                        <p className="mt-3 text-xl font-sans tracking-wide">Choice</p>
                        <div className="mt-1 flex">
                            <label className={cx('radio-button')}>
                                <input
                                    type="radio"
                                    name={`exercise${exercise?.id}idx${idxEx}`}
                                    value="ONE_CHOICE"
                                    checked={exercise?.type === 'ONE_CHOICE'}
                                    onChange={(e) => handleChangeTypeQuestion(e, idxEx)}
                                />
                                <span className={cx('radio')}></span>
                                One choice
                            </label>

                            <label className={cx('radio-button')}>
                                <input
                                    type="radio"
                                    name={`exercise${exercise?.id}idx${idxEx}`}
                                    value="MULTI_CHOICE"
                                    checked={exercise?.type === 'MULTI_CHOICE'}
                                    onChange={(e) => handleChangeTypeQuestion(e, idxEx)}
                                />
                                <span className={cx('radio')}></span>
                                Multi choice
                            </label>
                        </div>

                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {exercise?.choice &&
                                exercise?.choice.length !== -1 &&
                                exercise?.choice.map((choice, idxCh) => {
                                    return (
                                        <ListItem key={`choice${choice?.id}`} disablePadding sx={{ margin: '10px 0' }}>
                                            <input
                                                className={cx('checkbox')}
                                                type="checkbox"
                                                tabIndex={-1}
                                                checked={choice?.right}
                                                onChange={(e) =>
                                                    handleChangeCheckChoice(e, exercise?.type, idxEx, idxCh)
                                                }
                                            ></input>
                                            <ContentChoice
                                                idxEx={idxEx}
                                                idxCh={idxCh}
                                                data={choice.content}
                                                onSetText={handleChangeContentChoice}
                                            />
                                        </ListItem>
                                    );
                                })}
                        </List>
                        <p className="mt-1 text-xl font-sans tracking-wide">Solution</p>
                        <InputMultiline idx={idxEx} data={exercise?.solution} onSetText={handleChangeSolutionContent} />
                    </div>
                ))}
        </>
    );
};

const Content = ({ cont, onSetContent }) => {
    const [contentTemp, setContentTemp] = useState(cont);
    const ckeditorHandle = (e, editor) => {
        setContentTemp(editor.getData());
    };
    const handleBlurCk = () => {
        onSetContent(contentTemp);
    };
    console.log(contentTemp);
    return (
        contentTemp !== null && (
            <CKEditor
                editor={ClassicEditor}
                data={contentTemp}
                onReady={(editor) => {
                    console.log('Editor1 is ready to use!', editor);
                }}
                onChange={ckeditorHandle}
                onBlur={handleBlurCk}
            />
        )
    );
};

const ContentChoice = ({ data, onSetText, idxEx, idxCh }) => {
    const [inputValue, setInputValue] = useState(data || '');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handelOnBlur = () => {
        onSetText(inputValue, idxEx, idxCh);
    };
    return (
        <InputBase
            multiline
            sx={{
                marginLeft: '10px',
                width: '100%',
                overflow: 'auto',
                borderRadius: '12px',
                border: '1.5px solid lightgrey',
            }}
            value={inputValue}
            onChange={handleChange}
            onBlur={handelOnBlur}
        />
    );
};

export default UpdateCourse;
