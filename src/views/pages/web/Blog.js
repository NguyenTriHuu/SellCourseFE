import styles from './scss/Blog.module.scss';
import classNames from 'classnames/bind';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useEffect, useState } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import { styled, alpha } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FlagIcon from '@mui/icons-material/Flag';
import { EmailShareButton, FacebookShareButton, FacebookShareCount } from 'react-share';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Image from 'src/views/image/Image';
import Pagination from '@mui/material/Pagination';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import DrawerCustom from './Drawer';

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

function Blog() {
    const cx = classNames.bind(styles);
    const [anchorEls, setAnchorEls] = useState({});
    const [copySuccess, setCopySuccess] = useState('');
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState();
    const [data, setData] = useState({});
    const [suggests, setSuggests] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    // const timeAgo = moment(comment.createdAt).fromNow();
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    const [state, setState] = useState({
        openSnack: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, openSnack } = state;

    const handleCloseSnack = () => {
        setState({ ...state, openSnack: false });
    };

    const handleClickMenu = (event, index) => {
        console.log(event.currentTarget);

        setAnchorEls({ ...anchorEls, [index]: event.currentTarget });
    };
    const handleClose = (index) => {
        setAnchorEls({ ...anchorEls, [index]: null });
    };
    async function copyToClip() {
        await navigator.clipboard.writeText(location.href);
        setState({ ...state, openSnack: true });
        setCopySuccess('Copied');
        setAnchorEl(null);
    }

    const handleClickChip = (e, item) => {
        e.stopPropagation();
        setCategory({ ...item });
    };

    useEffect(() => {
        let url = `/api/blog/get-all-category/${category?.id}`;
        let params = {
            page: page - 1,
            size: 5,
        };
        fechtData(url, params);
    }, [category]);

    const fechtData = (url, params) => {
        console.log(url);
        axiosPrivate
            .get(url, { params: { ...params } })
            .then((res) => {
                console.log(res?.data);
                setData(res?.data);
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        let url = '';
        let params = {};
        if (!category) {
            if (search) {
                url = `/api/blog/search`;
                params = {
                    page: page - 1,
                    size: 5,
                    search: search,
                };
            } else {
                url = `/api/blog/get-all`;
                params = {
                    page: page - 1,
                    size: 5,
                };
            }
        } else {
            url = `/api/blog/get-all-category/${category?.id}`;
            params = {
                page: page - 1,
                size: 5,
            };
        }
        fechtData(url, params);
    }, [page]);

    useEffect(() => {
        axiosPrivate
            .get('/api/category/all')
            .then((res) => setSuggests(res?.data))
            .catch((e) => console.log(e));
    }, []);

    const handleClickRead = (event, id) => {
        event.stopPropagation();
        console.log(' đã click');
        navigate('/blog/read', { state: { idBlog: id } });
    };

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleEnterSearch = (event) => {
        if (event.key === 'Enter') {
            let url = `/api/blog/search`;
            let params = {
                page: page - 1,
                size: 5,
                search: search,
            };
            fechtData(url, params);
        }
    };

    return (
        <div className="grid">
            <div className="row">
                <div className="col l-8 flex flex-col">
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

                    <h1 className="mb-5 mt-5">Các bài viết</h1>

                    <div className="min-h-fit">
                        {data &&
                            data?.content &&
                            data.content.map((item, idx) => (
                                <div className={cx('task')} key={idx}>
                                    <div className={cx('tags')}>
                                        <span className={cx('tag')}>{item?.nameUser}</span>
                                        <button onClick={(e) => handleClickMenu(e, idx)} className={cx('options')}>
                                            <svg
                                                xmlBase="preserve"
                                                viewBox="0 0 41.915 41.916"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="Capa_1"
                                                version="1.1"
                                                fill="#000000"
                                            >
                                                <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                                                <g
                                                    strokeLinejoin="round"
                                                    strokeLinecap="round"
                                                    id="SVGRepo_tracerCarrier"
                                                ></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <g>
                                                        <g>
                                                            <path d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path>{' '}
                                                            <path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path>{' '}
                                                            <path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path>{' '}
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </button>
                                        <StyledMenu
                                            id="demo-customized-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'demo-customized-button',
                                            }}
                                            anchorEl={anchorEls[idx]}
                                            open={Boolean(anchorEls[idx])}
                                            onClose={() => handleClose(idx)}
                                        >
                                            <MenuItem onClick={handleClose} disableRipple>
                                                <FacebookShareButton
                                                    url={
                                                        'https://fullstack.edu.vn/blog/authentication-authorization-trong-reactjs.html'
                                                    }
                                                >
                                                    <FacebookIcon />
                                                    Chia sẻ lên Facebook
                                                </FacebookShareButton>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} disableRipple>
                                                <EmailShareButton
                                                    url={'http://localhost:3000/blog'}
                                                    subject={'title'}
                                                    body="body"
                                                >
                                                    <EmailIcon />
                                                    Chia sẻ qua Email
                                                </EmailShareButton>
                                            </MenuItem>

                                            <MenuItem onClick={copyToClip} disableRipple>
                                                <AttachmentIcon />
                                                Sao chép liên kết
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} disableRipple>
                                                <FlagIcon />
                                                Báo cáo bài viết
                                            </MenuItem>
                                        </StyledMenu>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                        <div
                                            className="h-32 pt-2 px-4 pb-2"
                                            onClick={(e) => handleClickRead(e, item?.id)}
                                        >
                                            <Image
                                                id={item?.id}
                                                url={`http://localhost:8080/api/blog/${item?.id}/thumnail`}
                                                queryKey="thumbnailBlog"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <h4>{item?.title}</h4>
                                            <p onClick={(e) => handleClickRead(e, item?.id)}>
                                                {item?.shortDescription}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={cx('stats')}>
                                        <div>
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                                                    <g
                                                        strokeLinejoin="round"
                                                        strokeLinecap="round"
                                                        id="SVGRepo_tracerCarrier"
                                                    ></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeWidth="2"
                                                            d="M12 8V12L15 15"
                                                        ></path>
                                                        <circle strokeWidth="2" r="9" cy="12" cx="12"></circle>
                                                    </g>
                                                </svg>
                                                {moment(item?.dateCreate).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <Pagination count={data?.totalPages || 1} page={page} onChange={handleChangePage} />
                    </div>
                </div>
                <div className="col l-4">
                    <h1> Các chủ đề</h1>
                    <div>
                        {suggests &&
                            suggests.length > 0 &&
                            suggests.map((item, idx) => (
                                <Chip
                                    label={`${item?.name}`}
                                    onClick={(e) => handleClickChip(e, item)}
                                    key={uuidv4()}
                                />
                            ))}
                    </div>
                </div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={openSnack}
                    onClose={handleCloseSnack}
                    message="Đã sao chép"
                    key={vertical + horizontal}
                />
                <Create />
            </div>
        </div>
    );
}

const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    color: '#49bdb7f7',
};

const fab = {
    color: '#49bdb7f7',
    sx: fabStyle,
    icon: <NoteAddOutlinedIcon sx={{ mr: 1 }} />,
    label: 'Add',
};

function Create() {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.stopPropagation();
        navigate('/blog/create');
    };
    return (
        <>
            <Fab variant="extended" sx={fab.sx} aria-label={fab.label} color="inherit" onClick={handleClick}>
                {fab.icon}
                Create New
            </Fab>
        </>
    );
}

export default Blog;
