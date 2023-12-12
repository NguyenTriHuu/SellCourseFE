import { useEffect, useState } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import jwtDecode from 'jwt-decode';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import styles from './scss/MyBlog.module.scss';
import classNames from 'classnames/bind';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const names = ['STUDENT', 'TEACHER'];
const style = {
    padding: '5px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
            },
        },
    },
}));

const columns = [
    { field: 'title', headerName: 'Tiêu đề ', width: 250 },
    { field: 'shortDescription', headerName: 'Mô tả ngắn', width: 250 },
    {
        field: 'dateCreate',
        headerName: 'Ngày đăng',
        type: 'time',
        width: 150,
    },
    {
        field: 'dateModified',
        headerName: 'Ngày chỉnh sửa',
        type: 'time',
        width: 150,
    },
    { field: 'numOfInteract', headerName: 'Số like', width: 100 },
    { field: 'numOfComment', headerName: 'Số bình luận', width: 100 },
    { field: 'views', headerName: 'Lượt xem', width: 100 },
    {
        field: 'status',
        headerName: 'Tình trạng',
        valueGetter: (params) => (params.row.status ? 'active' : 'locked'),
    },
];

function MyBlog() {
    const [data, setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const [select, setSelect] = useState([]);
    const cx = classNames.bind(styles);
    const [search, setSearch] = useState('');
    const [openModalMessage, setOpenModalMessage] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    useEffect(() => {
        axiosPrivate
            .get(`/api/blog/my-blog/${token?.sub}`)
            .then((res) => {
                setData(res?.data);
            })
            .catch((e) => console.log(e));
    }, []);
    console.log(data);
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleEnterSearch = (event) => {
        if (event.key === 'Enter') {
            axiosPrivate
                .get(`/api/blog/search/${token?.sub}`, { params: { search: search } })
                .then((res) => setData([...res?.data]))
                .catch((e) => console.log(e));
        }
    };
    const handleCloseModalMessage = (e) => {
        e.stopPropagation();
        setOpenModalMessage(false);
    };

    const handleCloseModalSuccess = (e) => {
        e.stopPropagation();
        setOpenModalSuccess(false);
    };

    const handleBlock = (value1, value2) => {
        axiosPrivate
            .post(`/api/blog/block/${value1}/${value2}`)
            .then((res) => {
                setOpenModalSuccess(true);
                console.log(res);
            })
            .catch((e) => {
                setOpenModalMessage(true);
                console.log(e);
            });
    };
    return (
        <div className="grid">
            <div className="row">
                <div className="flex rounded-lg p-1 ml-5 flex-row justify-between">
                    <div className={cx('search')}>
                        <input
                            type="text"
                            className={cx('search__input')}
                            placeholder="Type your text"
                            value={search}
                            onChange={handleChangeSearch}
                            onKeyDown={handleEnterSearch}
                        />
                        <button className={cx('search__button')}>
                            <svg className={cx('search__icon')} aria-hidden="true" viewBox="0 0 24 24">
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                    <div className="mt-3">
                        <MenuAction
                            data={select}
                            onLock={handleBlock}
                            status={data && data.find((item) => item?.id === select[0])?.status}
                        />
                    </div>
                </div>
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row.id}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelect(newRowSelectionModel);
                    }}
                    rowSelectionModel={select}
                    disableRowSelectionOnClick
                />
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
                                    window.location.reload();
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
                                <p className="ml-2 text-2xl font-sans tracking-widest">Success </p>
                            </div>

                            <p className="text-base font-sans tracking-widest">Thao tác thành công</p>
                        </div>
                        <div className="mt-5 flex grid justify_items-end">
                            <Button
                                variant="contained"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenModalSuccess(false);
                                    window.location.reload();
                                }}
                            >
                                OK
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

function MenuAction({ data, status, onLock }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLock = () => {
        setAnchorEl(null);
        onLock(data[0], false);
    };
    const handleUnLock = () => {
        setAnchorEl(null);
        onLock(data[0], true);
    };
    const handleReview = () => {
        setAnchorEl(null);
        navigate('/blog/read', { state: { idBlog: data[0] } });
    };

    const handleUpdate = () => {
        setAnchorEl(null);
        navigate('/blog/update', { state: { idBlog: data[0] } });
    };

    return (
        <>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Options
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLock} disableRipple disabled={(data && data.length !== 1) || !status}>
                    <EditIcon />
                    Chặn
                </MenuItem>

                <MenuItem onClick={handleUnLock} disableRipple disabled={(data && data.length !== 1) || status}>
                    <EditIcon />
                    Mở chặn
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem disableRipple disabled={data && data.length !== 1} onClick={handleReview}>
                    <FileCopyIcon />
                    Xem chi tiết
                </MenuItem>
                <MenuItem disableRipple disabled={data && data.length !== 1} onClick={handleUpdate}>
                    <FileCopyIcon />
                    Chỉnh sửa
                </MenuItem>
            </StyledMenu>
        </>
    );
}

export default MyBlog;
