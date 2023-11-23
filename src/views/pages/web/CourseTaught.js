import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import stylesAllCourse from './scss/AllCourse_CourseTaught.module.scss';
import classNames from 'classnames/bind';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import qs from 'qs';
import MenuItem from '@mui/material/MenuItem';
function CourseTaught() {
    const [open, setOpen] = useState('allcourse');
    const handleSetOpen = (e, value) => {
        e.stopPropagation();
        setOpen(value);
    };
    return (
        <div className="grid">
            <div className="row">
                <div className="col l-3">
                    <List>
                        <ListItem>
                            <ListItemButton
                                onClick={(e) => {
                                    handleSetOpen(e, 'allcourse');
                                }}
                            >
                                <ListItemIcon>
                                    <ListAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="All Course" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem>
                            <ListItemButton
                                onClick={(e) => {
                                    handleSetOpen(e, 'comment');
                                }}
                            >
                                <ListItemIcon>
                                    <PersonOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Comment Management" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem>
                            <ListItemButton
                                onClick={(e) => {
                                    handleSetOpen(e, 'blog');
                                }}
                            >
                                <ListItemIcon>
                                    <PersonOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="Blog Management" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
                <div className="col l-9">
                    <div hidden={open !== 'allcourse'}>
                        <AllCourse />
                    </div>
                    <div hidden={open !== 'comment'}>
                        <CommentManagement />
                    </div>
                    <div hidden={open !== 'blog'}>
                        <BlogManagement />
                    </div>
                </div>
            </div>
        </div>
    );
}

const AllCourse = () => {
    const axiosPrivate = useAxiosPrivate();
    const cx = classNames.bind(stylesAllCourse);
    const [selectionFilter, setSelectionFilter] = useState();
    const [categorySelect, setCategorySelect] = useState();
    const [programSelect, setProgramSelect] = useState();
    const [subjectSelect, setSubjectSelected] = useState();
    const [statusSelect, setStatusSelect] = useState('');
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ search: '', subject: '' });
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const navigate = useNavigate();
    console.log(rowSelectionModel);
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
    useEffect(() => {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        setMeta(query);
    }, [location.search]);

    useEffect(() => {
        const queryString = generate('/api/courses', meta);
        axiosPrivate
            .get(`${queryString.pathname}`)
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        axiosPrivate
            .get('/api/category/tree')
            .then((response) => {
                setSelectionFilter(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setMeta((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'approveddate', headerName: 'Approved date', width: 130 },
        {
            field: 'subject1',
            headerName: 'Subject',
            width: 90,
            valueGetter: (params) => params?.row?.subject?.name,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 90,
        },
        {
            field: 'duration',
            headerName: 'Duration',
            width: 90,
        },
        {
            field: 'numberMembers',
            headerName: 'N.O Members',
            sortable: false,
            width: 160,
        },
        {
            field: 'status',
            headerName: 'Status',
            sortable: false,
            width: 160,
            valueGetter: (params) => (params?.status === true ? 'Active' : 'Block'),
        },
    ];
    console.log(queryString.pathname);
    console.log(queryString.search);
    const handleUpdate = () => {
        console.log('dsdsdsds');
        navigate('/course/update', { state: { idCourse: rowSelectionModel[0] } });
    };
    return (
        <>
            <div className="grid">
                <div className="mt-20 mb-10">
                    <h1 className="text-2xl font-sans tracking-wider ">All Course</h1>
                </div>
                <div className="row mb-3">
                    <div className="col l-3 p-2">
                        <div className={cx('group')}>
                            <svg className={cx('icon')} aria-hidden="true" viewBox="0 0 24 24">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                            <input
                                placeholder="Search"
                                type="search"
                                name="stringQuery"
                                className={cx('input')}
                                onChange={handleChangeInput}
                            />
                        </div>
                    </div>
                    <div className="col l-9">
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
                            Filter
                        </button>
                    </div>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={data?.listCourse || []}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        disableRowSelectionOnClick
                    />
                </div>
                <div className="relative mt-3">
                    <div className="absolute right-5">
                        <button
                            disabled={rowSelectionModel.length === 0}
                            className={`${cx('button')}`}
                            onClick={(e) => {
                                console.log('delete');
                            }}
                        >
                            Delete
                        </button>
                        <button
                            disabled={rowSelectionModel.length !== 1}
                            className={`${cx('button')} ml-4`}
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const CommentManagement = () => {
    return (
        <>
            <h1>Comment management</h1>
        </>
    );
};

const BlogManagement = () => {
    return (
        <>
            <h1>Blog management</h1>
        </>
    );
};

export default CourseTaught;
