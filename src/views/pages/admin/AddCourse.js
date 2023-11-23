import { useLocation, useNavigate } from 'react-router-dom';
import { CForm, CFormInput, CCol, CInputGroup, CInputGroupText } from '@coreui/react';
import Paper from '@mui/material/Paper';
import styles from './scss/AddCourse.module.scss';
import classNames from 'classnames/bind';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect, useCallback } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useRef } from 'react';
import DropZone from 'src/views/dropzone/DropZone';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import MouseIcon from '@mui/icons-material/Mouse';
import BuildIcon from '@mui/icons-material/Build';
import dayjs from 'dayjs';
import Modal from 'src/views/modal/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import InputAdornment from '@mui/material/InputAdornment';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function AddCourse() {
    const [dataCourse, setDataCourse] = useState({});
    const [data, setData] = useState([]);
    const [category, setCategory] = useState({});
    const [program, setProgram] = useState({});
    const [teachers, setTeachers] = useState([]);
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(styles);
    const options = [];
    const ref = useRef(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    let indexOrigin = null;
    let draggedOverItem = null;
    const [disableInput, setDisableInput] = useState(false);
    const [thumbnail, setThumbnail] = useState();
    const [videoIntro, setVideoIntro] = useState();
    const [subjectCode, setSubjectCode] = useState({});
    const [courseDetail, setCourseDetail] = useState([]);
    const [hiddenInputAddThematic, setHiddenInputAddThematic] = useState(true);
    const [nameCourseTemp, setNameCourseTemp] = useState('');
    const [nameLecture, setNameLecture] = useState('');
    const courseId = useRef(0);
    const [test, setTest] = useState('');
    const [rerender, setRerender] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [modal, setModal] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        console.log('render');
        axiosPrivate
            .get('/api/category/tree')
            .then((response) => {
                console.log(response);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axiosPrivate
            .get('/api/user/allteacher')
            .then((response) => {
                console.log(response);
                setTeachers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        location?.state?.idCourse &&
            axiosPrivate
                .get('/api/course', { params: { id: location?.state?.idCourse } })
                .then((response) => {
                    setDataCourse(response.data);
                    setCourseDetail(response.data.thematics);
                    //console.log(dataCourse);
                    console.log(response);
                    console.log(data);
                    axiosPrivate
                        .get('/api/category', { params: { idSubject: response.data.subject.id } })
                        .then((res) => {
                            setDataCourse((prv) => ({
                                ...prv,
                                category: res.data.nameCategory,
                                program: res.data.nameProgram,
                            }));
                        })
                        .catch((err) => {});
                })
                .catch((error) => {
                    console.log(error);
                });
    }, [ref.current]);

    const handleChangeCategory = (event, newValue) => {
        if (newValue) {
            setCategory(data.find((value) => value.nameCategoryResponse === newValue));
            setDataCourse((prv) => ({
                ...prv,
                category: newValue,
                program: '',
                subject: null,
            }));
        } else {
            setCategory({});
            setDataCourse((prv) => ({
                ...prv,
                category: '',
                program: '',
                subject: null,
            }));
        }
    };

    const handleChangeProgram = (event, newValue) => {
        if (newValue) {
            setProgram(category.educationResponseList.find((value) => value.nameProgramEducationResponse === newValue));
            setDataCourse((prv) => ({
                ...prv,
                program: newValue,
                subject: null,
            }));
        } else {
            setProgram({});
            setDataCourse((prv) => ({
                ...prv,
                program: '',
                subject: null,
            }));
        }
    };

    const handleChangeSubject = (event, newValue) => {
        newValue
            ? setDataCourse((prv) => ({
                  ...prv,
                  subject: { ...program.subjectResponseList.find((subject) => subject.name === newValue) },
              }))
            : setDataCourse((prv) => ({
                  ...prv,
                  subject: null,
              }));
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickDelete = (e, idx, indexLec, dlItem) => {
        //console.log(courseDetail);
        e.stopPropagation();
        let items = null;
        if (indexLec) {
            items = courseDetail[idx].lectures.filter((item) => item.title !== dlItem);
            let thematic = { ...courseDetail[idx] };
            thematic = {
                ...thematic,
                lectures: [...items],
            };
            let thematics = courseDetail.filter((course) => course.name !== courseDetail[idx].name);
            thematics.splice(idx, 0, thematic);
            return setCourseDetail([...thematics]);
        } else {
            items = courseDetail.filter((item) => item.name !== dlItem);
            return setCourseDetail([...items]);
        }
    };
    const handleClickBuild = (inp) => (e) => {
        e.stopPropagation();
        (disableInput !== inp) & setDisableInput(inp);
        console.log(inp);
        console.log(disableInput);
    };

    //Drag & drop
    const onDragStart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', e.target.id);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    };

    const onDrop = (e, idx, indexLec) => {
        console.log(e.dataTransfer.getData('text'));
        let draggedItem = null;
        let items = null;
        if (e.dataTransfer.getData('text').startsWith('thematic')) {
            draggedItem = courseDetail[e.dataTransfer.getData('text').substring(9)].name;
            draggedOverItem = courseDetail[idx].name;
            items = courseDetail.filter((item) => item.name !== draggedItem);
        } else {
            draggedItem =
                courseDetail[e.dataTransfer.getData('text').substring(8, 9)].lectures[
                    e.dataTransfer.getData('text').substring(10)
                ].title;
            draggedOverItem = courseDetail[idx].lectures[indexLec].title;
            items = courseDetail[idx].lectures.filter((item) => item.title !== draggedItem);
            // indexOrigin = indexLec;
        }
        console.log('draggedItem ', draggedItem);
        console.log(idx, indexLec);
        console.log('dragOverItem ', draggedOverItem);
        // if the item is dragged over itself, ignore
        if (draggedItem === draggedOverItem) {
            return;
        }

        draggedOverItem;

        // filter out the currently dragged item
        console.log(items);
        // add the dragged item after the dragged over item
        console.log(indexLec);

        if (e.dataTransfer.getData('text').startsWith('thematic')) {
            console.log('idx', idx);
            items.splice(
                idx,
                0,
                courseDetail.find((item) => item.name === draggedItem),
            );

            console.log('Vaof dc ts day');
            setCourseDetail(items);
        } else {
            console.log('indexLec', indexLec);
            items.splice(
                indexLec,
                0,
                courseDetail[idx].lectures.find((item) => item.title === draggedItem),
            );
            let courseDetailX = courseDetail;
            courseDetailX[idx].lectures = items;
            setCourseDetail(courseDetailX);
            setRerender(items);
        }

        console.log('items after ', items);
        /*items.splice(
                  indexLec,
                  0,
                  courseDetail[idx].lectures.find((item) => item === draggedItem),
              )*/
        /* items.splice(
                  idx,
                  0,
                  courseDetail.find((item) => item.thematicName === draggedItem),
              );*/
        //indexLec ? (courseDetail[idx].lectures = items) : (courseDetail = items);

        // console.log(courseDetail[index].lectures.find((item) => item === draggedItem));
        //console.log(index);
        console.log(courseDetail);
    };

    const onDragOver = (e, idx, indexLec) => {
        e.preventDefault();
        //indexLec
        //  ? (draggedOverItem = courseDetail[idx].lectures[indexLec])
        //  : (draggedOverItem = courseDetail[idx].thematicName);
    };

    const onDragEnd = () => {
        draggedItem = null;
    };

    const handleClickAddThematic = (e) => {
        setHiddenInputAddThematic(false);
    };
    const handleClickEnterAddCourse = (e) => {
        setHiddenInputAddThematic(true);
        const co = {
            name: nameCourseTemp,
            lectures: [],
        };
        setCourseDetail([...courseDetail, co]);
    };
    console.log(thumbnail);
    console.log(videoIntro);
    const handleClickCreateOrUpdateCourse = (e) => {
        const thematics = courseDetail;
        const formData = new FormData();
        thumbnail ? formData.append('thumdnail', thumbnail) : formData.append('thumdnail', null);
        videoIntro ? formData.append('file', videoIntro) : formData.append('file', null);
        formData.append('title', dataCourse?.title);
        formData.append('description', dataCourse?.description);
        formData.append('price', dataCourse?.price);
        formData.append('teacherId', dataCourse?.teacher?.id);
        formData.append('subject', dataCourse?.subject.code);
        formData.append('duration', dataCourse?.duration);
        formData.append('shortDescription', dataCourse?.shortDescription);
        dataCourse.dateStart && formData.append('dateStart', dayjs(dataCourse.dateStart).format());
        if (!location?.state?.idCourse) {
            setLoading(true);
            axiosPrivate
                .post(`/api/course/save`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    courseId.current = response.data.id;
                    setDataCourse(response.data);
                    console.log(courseId.current);
                    console.log(response);
                    axiosPrivate
                        .post(`/api/course/save/${courseId.current}/detail`, thematics, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then((res) => {
                            setLoading(false);
                            console.log(res);
                            setModal({
                                type: 'SUCCESS',
                                onClose: () => {
                                    navigate(-1, { state: { courseForcus: courseId.current } });
                                },
                                action: () => {
                                    window.location.reload();
                                },
                                message: 'Successful course addition! You can review or return to the course list ',
                                titleMessage: 'Notification ',
                                nameButton: 'Add new',
                            });
                            setOpenModal(true);
                        })
                        .catch((error) => {
                            console.log(error);
                            setLoading(false);
                            setModal({
                                type: 'ERROR',
                                onClose: () => {
                                    setOpenModal(false);
                                },
                                action: () => {
                                    navigate(-1);
                                },
                                message: 'Update failure, system error',
                                titleMessage: 'Error Message ',
                                nameButton: 'Return list',
                            });
                            setOpenModal(true);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    setModal({
                        type: 'ERROR',
                        onClose: () => {
                            //window.location.reload();
                            setModal(false);
                        },
                        action: () => {
                            navigate(-1);
                        },
                        message: 'Update failure, system error',
                        titleMessage: 'Error Message ',
                        nameButton: 'Return list',
                    });
                    setOpenModal(true);
                });

            console.log(courseId.current);
        } else {
            setLoading(true);
            formData.append('id', location?.state?.idCourse);
            console.log(courseDetail);
            formData.append('thematics', JSON.stringify(courseDetail));
            axiosPrivate
                .put('/api/course/update', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    const handle = () => {
                        navigate(-1, { state: { courseForcus: location?.state?.idCourse } });
                    };
                    setModal({
                        type: 'SUCCESS',
                        onClose: () => {
                            window.location.reload();
                        },
                        action: handle,
                        message: 'Updated data to the server successfully ',
                        titleMessage: 'Notification ',
                        nameButton: 'Return list',
                    });
                    setOpenModal(true);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                    setModal({
                        type: 'ERROR',
                        onClose: () => {
                            window.location.reload();
                        },
                        action: () => {
                            navigate(-1);
                        },
                        message: 'Update failure, system error',
                        titleMessage: 'Error Message ',
                        nameButton: 'Return list',
                    });
                    setOpenModal(true);
                });
        }
    };

    //End Drag & drop

    const ckeditorDesHandle = (e, editor) => {
        setDataCourse((prv) => ({
            ...prv,
            description: editor.getData(),
        }));
    };
    const ckeditorShortDesHandle = (e, editor) => {
        setDataCourse((prv) => ({
            ...prv,
            shortDescription: editor.getData(),
        }));
    };

    const handleChangeInput = (e, idx, indexOrigin) => {
        let courseTemp = [...courseDetail];
        console.log(courseDetail);
        console.log(e.target.value);
        const newValue = e.target.value;

        if (indexOrigin !== null) {
            //let lectures =[...courseTemp[idx].lectures]
            courseTemp[idx].lectures[indexOrigin].title = newValue;
        } else {
            courseTemp[idx].name = newValue;
        }
        setCourseDetail(courseTemp);
        // setTest(e.target.value);
        // console.log(test);
    };

    const handleAddLecture = (e, idx) => {
        let thematic = courseDetail[idx];
        let lectures = thematic.lectures;
        thematic.lectures = [...lectures, { title: nameLecture }];
        let course = courseDetail;
        course[idx] = thematic;
        setCourseDetail(course);
        setNameLecture('');
    };

    const handleChangeTaughtBy = (e, newValue) => {
        console.log(teachers);

        if (newValue) {
            setDataCourse((prv) => ({
                ...prv,
                teacher: { ...teachers.find((val) => val.fullname === newValue) },
            }));
        } else {
            setDataCourse((prv) => ({
                ...prv,
                teacher: {},
            }));
        }
    };

    const handleClickOpenModal = (e) => {
        e.stopPropagation();
        setOpenModal(true);
        setModal({
            ...modal,
            onClose: () => {
                setOpenModal(false);
            },
            action: () => {},
        });
    };

    return (
        <div>
            {location?.state?.idCourse ? <h1>Update Course</h1> : <h1>Add Course</h1>}
            <Paper elevation={3} className={cx('wraper')}>
                <h1>General configuration</h1>
                <CForm className="row gy-2 gx-3 align-items-center">
                    <div className={cx('input-container')}>
                        <input
                            placeholder="Name Course"
                            className={cx('input-field')}
                            type="text"
                            value={dataCourse.title || ''}
                            onChange={(e) => {
                                setDataCourse((prv) => ({ ...prv, title: e.target.value }));
                            }}
                        />
                        <label className={cx('input-label')}>Name Course</label>
                        <span className={cx('input-highlight')}></span>
                    </div>

                    <p className={cx('label-main')}>Category</p>

                    <Autocomplete
                        value={dataCourse.category ? dataCourse.category : null}
                        size="small"
                        sx={{ width: 300 }}
                        options={data.map((category) => category.nameCategoryResponse) || options}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select" />}
                        onChange={handleChangeCategory}
                    />
                    <p className={cx('label-main')}>Program</p>

                    <Autocomplete
                        value={dataCourse.program ? dataCourse.program : null}
                        size="small"
                        sx={{ width: 300 }}
                        options={
                            category.educationResponseList
                                ? category.educationResponseList.map((program) => program.nameProgramEducationResponse)
                                : options
                        }
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select" />}
                        onChange={handleChangeProgram}
                    />
                    <p className={cx('label-main')}>Subject</p>

                    <Autocomplete
                        value={dataCourse?.subject ? dataCourse.subject.name : null}
                        size="small"
                        sx={{ width: 300 }}
                        options={
                            program.subjectResponseList
                                ? program.subjectResponseList.map((subject) => subject.name)
                                : options
                        }
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select" />}
                        onChange={handleChangeSubject}
                    />
                    <p className={cx('label-main')}>Taught By</p>

                    <Autocomplete
                        value={dataCourse?.teacher?.fullname ?? null}
                        size="small"
                        sx={{ width: 300 }}
                        options={teachers ? teachers.map((val) => val.fullname) : options}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select" />}
                        onChange={handleChangeTaughtBy}
                    />
                    <p className={cx('label-main')}>Price</p>

                    <FormControl variant="standard" sx={{ ml: 1, width: '20ch' }}>
                        <Input
                            value={dataCourse?.price ?? ''}
                            id="standard-adornment-weight"
                            endAdornment={<InputAdornment position="end">Vnd</InputAdornment>}
                            onChange={(e) => {
                                setDataCourse((prv) => ({
                                    ...prv,
                                    price: e.target.value,
                                }));
                            }}
                        />
                    </FormControl>

                    <p className={cx('label-main')}>Date Start</p>
                    <CCol xs="auto">
                        <DatePicker
                            value={dataCourse.dateStart ? dayjs(dataCourse.dateStart) : dayjs('2023-01-01')}
                            onChange={(newValue) => setDataCourse((prv) => ({ ...prv, dateStart: newValue }))}
                        />
                    </CCol>
                    <CCol xs="auto">
                        <CInputGroup className={cx('input-group')}>
                            <CFormInput
                                placeholder="Expires"
                                value={dataCourse?.duration ?? ''}
                                onChange={(e) => {
                                    setDataCourse((prv) => ({
                                        ...prv,
                                        duration: e.target.value,
                                    }));
                                }}
                            />
                            <CInputGroupText id="basic-addon2">day</CInputGroupText>
                        </CInputGroup>
                    </CCol>
                    <p className={cx('label-main')}>Image</p>

                    <DropZone setFile={setThumbnail} />

                    <p className={cx('label-main')}>Video Introduce</p>

                    <DropZone setFile={setVideoIntro} />

                    <p className={cx('label-main')}>Short Description</p>

                    <CKEditor
                        editor={ClassicEditor}
                        data={dataCourse.shortDescription ?? '<p>Short description in here!!</p>'}
                        onReady={(editor) => {
                            console.log('Editor1 is ready to use!', editor);
                        }}
                        onChange={ckeditorShortDesHandle}
                    />
                    <p className={cx('label-main')}>Description</p>

                    <CKEditor
                        editor={ClassicEditor}
                        data={dataCourse.description ?? '<p>Description in here</p>'}
                        onReady={(editor) => {
                            console.log('Editor1 is ready to use!', editor);
                        }}
                        onChange={ckeditorDesHandle}
                    />
                </CForm>
            </Paper>
            <h1>Course Details</h1>
            <Paper elevation={3} className={cx('wraper')}>
                <div>
                    <div hidden={hiddenInputAddThematic}>
                        <FormControl sx={{ m: 1, width: 3 / 4 }} variant="standard">
                            <InputLabel htmlFor="input-add-thematic">Name lecture new</InputLabel>
                            <Input
                                id="input-add-thematic"
                                onChange={(e) => {
                                    setNameCourseTemp(e.target.value);
                                }}
                            />
                        </FormControl>
                        <button className={cx('btn')} onClick={handleClickEnterAddCourse} style={{ marginTop: 20 }}>
                            <VerticalAlignTopRoundedIcon />
                        </button>
                    </div>

                    <ul>
                        {courseDetail &&
                            courseDetail.map((thematic, idx) => (
                                <li key={idx}>
                                    <div>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                onDragOver={(e) => onDragOver(e, idx, indexOrigin)}
                                                onDrop={(e) => onDrop(e, idx, indexOrigin)}
                                            >
                                                <div
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e)}
                                                    id={`thematic-${idx}`}
                                                >
                                                    <InputBase
                                                        placeholder="Name Lecture"
                                                        value={`Thematic ${idx + 1}`}
                                                        sx={{ width: 70 }}
                                                    />
                                                    <InputBase
                                                        sx={{ ml: 1, flex: 1, width: 500 }}
                                                        placeholder="Name Lecture"
                                                        value={thematic.name}
                                                        onChange={(e) => {
                                                            handleChangeInput(e, idx, indexOrigin);
                                                        }}
                                                        endAdornment={
                                                            <button
                                                                className={cx('btn')}
                                                                onClick={(e) =>
                                                                    handleClickDelete(
                                                                        e,
                                                                        idx,
                                                                        indexOrigin,
                                                                        thematic.name,
                                                                    )
                                                                }
                                                            >
                                                                <DeleteForeverIcon />
                                                            </button>
                                                        }
                                                    />
                                                </div>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <ul onDragOver={(e) => e.preventDefault}>
                                                    {thematic &&
                                                        thematic.lectures.map((lecture, indexLec) => (
                                                            <li
                                                                key={indexLec}
                                                                onDragOver={(e) => onDragOver(e, idx, indexLec)}
                                                                onDrop={(e) => onDrop(e, idx, indexLec)}
                                                            >
                                                                <div
                                                                    draggable
                                                                    onDragStart={(e) => onDragStart(e)}
                                                                    id={`lecture-${idx}-${indexLec}`}
                                                                >
                                                                    <Accordion>
                                                                        <AccordionSummary
                                                                            expandIcon={<ExpandMoreIcon />}
                                                                        >
                                                                            <div>
                                                                                <InputBase
                                                                                    placeholder="Name Lecture"
                                                                                    value={`Lecture ${indexLec + 1}`}
                                                                                    sx={{ width: 60 }}
                                                                                />
                                                                                <InputBase
                                                                                    sx={{ ml: 1, flex: 1, width: 500 }}
                                                                                    placeholder="Name Lecture"
                                                                                    value={`${lecture.title}`}
                                                                                    onChange={(e) =>
                                                                                        handleChangeInput(
                                                                                            e,
                                                                                            idx,
                                                                                            indexLec,
                                                                                        )
                                                                                    }
                                                                                    endAdornment={
                                                                                        <button
                                                                                            className={cx('btn')}
                                                                                            onClick={(e) =>
                                                                                                handleClickDelete(
                                                                                                    e,
                                                                                                    idx,
                                                                                                    indexLec + 1,
                                                                                                    lecture.title,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <DeleteForeverIcon />
                                                                                        </button>
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </AccordionSummary>
                                                                        <AccordionDetails>
                                                                            {lecture.files &&
                                                                                lecture.files.map((value) => (
                                                                                    <div
                                                                                        style={{ marginLeft: 40 }}
                                                                                        key={value}
                                                                                    >
                                                                                        <input
                                                                                            disabled={
                                                                                                disableInput !==
                                                                                                `lecture-file-${value}`
                                                                                            }
                                                                                            placeholder="Name file"
                                                                                            type="text"
                                                                                            className={cx('input')}
                                                                                            value={`file ${value}`}
                                                                                        />
                                                                                        <IconButton
                                                                                            onClick={handleClickBuild(
                                                                                                `lecture-file-${value}`,
                                                                                            )}
                                                                                        >
                                                                                            <BuildIcon />
                                                                                        </IconButton>
                                                                                        <IconButton>
                                                                                            <CloudUploadIcon />
                                                                                        </IconButton>
                                                                                        <IconButton>
                                                                                            <DeleteIcon />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                ))}

                                                                            <div style={{ marginLeft: 40 }}>
                                                                                <input
                                                                                    placeholder="Name file"
                                                                                    type="text"
                                                                                    className={cx('input')}
                                                                                />
                                                                                <IconButton>
                                                                                    <MouseIcon />
                                                                                </IconButton>
                                                                                <IconButton>
                                                                                    <CloudUploadIcon />
                                                                                </IconButton>
                                                                                <IconButton>
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </div>

                                                                            <Paper
                                                                                elevation={3}
                                                                                style={{ marginTop: 20 }}
                                                                            >
                                                                                <div>
                                                                                    <FormControl
                                                                                        sx={{ m: 1, width: 3 / 4 }}
                                                                                        variant="standard"
                                                                                    >
                                                                                        <InputLabel
                                                                                            htmlFor={`standard-adornment-amount${idx}${indexLec}`}
                                                                                        ></InputLabel>
                                                                                        <Input
                                                                                            id={`standard-adornment-amount${idx}${indexLec}`}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <button
                                                                                        className={cx('btn')}
                                                                                        onClick={handleClickDelete}
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            right: 20,
                                                                                            marginTop: 10,
                                                                                        }}
                                                                                    >
                                                                                        <VerticalAlignTopRoundedIcon />
                                                                                    </button>
                                                                                </div>
                                                                            </Paper>
                                                                        </AccordionDetails>
                                                                    </Accordion>
                                                                </div>
                                                            </li>
                                                        ))}
                                                </ul>
                                                <Paper elevation={3} style={{ marginTop: 20 }}>
                                                    <div>
                                                        <FormControl sx={{ m: 1, width: 3 / 4 }} variant="standard">
                                                            <InputLabel htmlFor={`standard-adornment-amount${idx}`}>
                                                                Name lecture new
                                                            </InputLabel>
                                                            <Input
                                                                id={`standard-adornment-amount${idx}`}
                                                                onChange={(e) => setNameLecture(e.target.value)}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            className={cx('btn')}
                                                            onClick={(e) => handleAddLecture(e, idx)}
                                                            style={{ position: 'absolute', right: 20, marginTop: 10 }}
                                                        >
                                                            <VerticalAlignTopRoundedIcon />
                                                        </button>
                                                    </div>
                                                </Paper>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </li>
                            ))}
                    </ul>

                    <div className={cx('sticked')}>
                        <button type="button" className={cx('button')} onClick={handleClickAddThematic}>
                            <span className={cx('button__text')}>Add Thematic</span>
                            <span className={cx('button__icon')}>
                                <AddOutlinedIcon style={{ stroke: '#fff' }} />
                            </span>
                        </button>
                    </div>
                </div>
            </Paper>
            <div className={cx('wraper')}>
                <button
                    style={{ marginRight: 20, backgroundColor: '#f2f2f3' }}
                    role="button"
                    className={cx('button-name')}
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Cancel
                </button>
                <button role="button" className={cx('button-name')} onClick={handleClickCreateOrUpdateCourse}>
                    {location?.state?.idCourse ? 'Update' : 'Create'}
                </button>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
            <Modal {...modal} openModal={openModal} setOpenModal={setOpenModal} />
            <button onClick={handleClickOpenModal}>click me</button>
        </div>
    );
}

export default AddCourse;
