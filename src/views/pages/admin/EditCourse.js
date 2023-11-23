import styles from './scss/EditCourse.module.scss';
import classNames from 'classnames/bind';
import MenuCourse from 'src/views/menu/MenuCourse';
import { useState, useCallback, useEffect } from 'react';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import TableAllCourse from 'src/views/table/GridData';
function EditCourse() {
    const cx = classNames.bind(styles);
    const [courseSelect, setCourseSelect] = useState([]);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ search: '', subject: '' });
    const navigate = useNavigate();
    const [age, setAge] = useState('');
    const [page, setPage] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [selectionFilter, setSelectionFilter] = useState();
    const [categorySelect, setCategorySelect] = useState();
    const [programSelect, setProgramSelect] = useState();
    const [subjectSelect, setSubjectSelected] = useState();
    const [statusSelect, setStatusSelect] = useState('');
    function isEmpty(strIn) {
        if (strIn === undefined) {
            return true;
        } else if (strIn == null) {
            return true;
        } else if (strIn == '') {
            return true;
        } else {
            return false;
        }
    }

    function generate(pathname, meta) {
        // pathname ví dụ https://omg/members
        if (isEmpty(meta)) {
            return pathname;
        }

        const { search, ...rest } = meta;

        return {
            pathname,
            search: qs.stringify({
                ...(!isEmpty(rest) && rest),
            }),
        };
    }

    const queryString = generate('/api/courses', meta);
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            value !== ''
                ? setCategorySelect(selectionFilter.find((category) => category.codeCategory === value))
                : setCategorySelect();
            setProgramSelect();
            setSubjectSelected();
            setMeta((prevState) => ({
                ...prevState,
                program: '',
                [name]: value,
                subject: '',
            }));
        }
        if (name === 'program') {
            value !== ''
                ? setProgramSelect(
                      categorySelect.educationResponseList.find((program) => program.codeProgram === value),
                  )
                : setProgramSelect();
            setSubjectSelected();
            setMeta((prevState) => ({
                ...prevState,
                [name]: value,
                subject: '',
            }));
        }
        if (name === 'subject') {
            value !== ''
                ? setSubjectSelected(programSelect.subjectResponseList.find((subject) => subject.code === value))
                : setSubjectSelected();

            setMeta((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        if (name === 'status') {
            setStatusSelect(value);
            setMeta((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        setMeta((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    console.log(meta);
    console.log(queryString);
    console.log(location);
    useEffect(() => {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        setMeta(query);
        console.log('location.search is replace');
    }, [location.search]);

    useEffect(() => {
        const queryString = generate('/api/courses', meta);
        console.log(location);
        console.log(queryString);

        axiosPrivate
            .get(`${queryString.pathname}`)
            .then((res) => {
                console.log(res);
                setData(res?.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axiosPrivate
            .get('/api/category/tree')
            .then((response) => {
                console.log(response);
                setSelectionFilter(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleDelete = useCallback(() => {
        axiosPrivate
            .delete(`/api/course/delete/${courseSelect}`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => console.log(error));
    }, [courseSelect]);

    const handleFilter = () => {
        // navigate(queryString.pathname, { state: queryString.search });
        const params = qs.parse(queryString.search, { ignoreQueryPrefix: true });
        axiosPrivate
            .get(queryString.pathname, { params: params })
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((error) => console.log(error));

        console.log('dsds');
    };
    const handleEdit = () => {
        navigate('/admin/editcourse/add', { state: { idCourse: courseSelect } });
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setMeta((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSetSelectCourses = useCallback((value) => {
        setCourseSelect(value);
    }, []);

    //<FormHelperText>Required</FormHelperText>
    return (
        <>
            <div className="grid grid-cols-8 gap-4 grid-flow-col auto-cols-max">
                <div className={`${cx('container-input')} col-span-2`}>
                    <input
                        type="text"
                        placeholder="Search"
                        name="stringQuery"
                        className={cx('input')}
                        onChange={handleChangeInput}
                    />
                    <svg
                        fill="#000000"
                        width="20px"
                        height="20px"
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </div>
                <div className={`${cx('filter')} col-span-5`}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-disabled-label">Category</InputLabel>
                        <Select
                            id="demo-simple-select-disabled"
                            name="category"
                            value={categorySelect ? categorySelect.codeCategory : ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {selectionFilter &&
                                selectionFilter.map((category, idx) => (
                                    <MenuItem key={idx} value={category.codeCategory}>
                                        {category.nameCategoryResponse}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-error-label">Program</InputLabel>
                        <Select
                            id="demo-simple-select-error"
                            name="program"
                            value={programSelect ? programSelect.codeProgram : ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {categorySelect &&
                                categorySelect.educationResponseList.map((program, idx) => (
                                    <MenuItem key={idx} value={program.codeProgram}>
                                        {program.nameProgramEducationResponse}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-readonly-label">Subject</InputLabel>
                        <Select
                            id="demo-simple-select-readonly"
                            name="subject"
                            value={subjectSelect ? subjectSelect.code : ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {programSelect &&
                                programSelect.subjectResponseList.map((subject, idx) => (
                                    <MenuItem key={idx} value={subject.code}>
                                        {subject.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" required sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-required-label">Status</InputLabel>
                        <Select
                            id="demo-simple-select-required"
                            name="status"
                            value={statusSelect}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Block</MenuItem>
                        </Select>
                    </FormControl>
                    <button
                        className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
                                  border-blue-600
                                  border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                                  active:border-b-[2px] active:brightness-90 active:translate-y-[2px] mt-6"
                        onClick={handleFilter}
                    >
                        Button
                    </button>
                </div>
                <div className="mt-6">
                    <MenuCourse onDelete={handleDelete} data={courseSelect} />
                </div>
            </div>

            <div className={cx('pd')}>
                {/* <CourseTable onSetSelect={setCourseSelect} data={data} onSetPage={setPage} />*/}
                <TableAllCourse data={data} onSelectCourse={handleSetSelectCourses} courseSelect={courseSelect} />
            </div>
        </>
    );
}

export default EditCourse;
