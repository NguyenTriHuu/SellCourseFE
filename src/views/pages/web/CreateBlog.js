import styles from './scss/CreateBlog.module.scss';
import classNames from 'classnames/bind';
import { EditorState, convertToRaw } from 'draft-js';
import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import jwtDecode from 'jwt-decode';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

function CreateBlog() {
    const cx = classNames.bind(styles);
    const theme = useTheme();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [categories, setCategories] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [categorySelect, setCategorySelect] = useState('');
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState();
    const token = jwtDecode(localStorage.getItem('AccessToken'));
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [contentDialog, setContentDialog] = useState({});
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    useEffect(() => {
        axiosPrivate
            .get('/api/category/all')
            .then((res) => setCategories(res?.data))
            .catch((e) => console.log(e));
    }, []);

    const handleChange = (event) => {
        event.stopPropagation();
        setCategorySelect(event.target.value);
    };

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleClick = () => {
        console.log('đẫ click');
        setOpenBackdrop(true);
        const contentInHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(contentInHtml, 'text/html');
        const plainText = htmlDoc.body.innerText;
        const words = plainText.split(' ');
        const first15Words = words.slice(0, 15).join(' ');

        let formData = new FormData();

        formData.append('title', title);
        formData.append('idCategory', categorySelect);
        formData.append('userName', token?.sub);
        formData.append('thumbnail', thumbnail);
        formData.append('content', JSON.stringify(contentInHtml));
        formData.append('shortDescription', first15Words);

        axiosPrivate
            .post('/api/blog/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                setOpenBackdrop(false);
                setOpenDialog(true);
                setContentDialog({ type: 'Success', message: 'Đăng thành công' });
                console.log(res);
                window.location.reload();
            })
            .catch((e) => {
                setOpenBackdrop(false);
                setOpenDialog(true);
                setContentDialog({ type: 'Error', message: 'Đăng thất bại, vui lòng thử lại sau' });
                console.log(e);
            });
    };

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleChangeThumnail = (event) => {
        setThumbnail(event.target.files[0]);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div>
            <div className={`${cx('group')} mt-16 mb-10`}>
                <input required="" type="text" className={cx('input')} value={title} onChange={handleChangeTitle} />
                <span className={cx('highlight')}></span>
                <span className={cx('bar')}></span>
                <label>Tiêu đề</label>
            </div>
            <div className="mt-3 mb-10">
                <Select
                    sx={{ width: '50%' }}
                    variant="standard"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={categorySelect}
                    label="Category"
                    onChange={handleChange}
                >
                    <MenuItem key={''} value={''}>
                        Chọ thể loại bài viết
                    </MenuItem>
                    {categories &&
                        categories.map((category, idx) => (
                            <MenuItem key={idx} value={category?.id}>
                                {category?.name}
                            </MenuItem>
                        ))}
                </Select>
            </div>
            <div className="mt-3 mb-10">
                <div className="grid w-full max-w-xs items-center gap-1.5">
                    <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleChangeThumnail}
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                    />
                </div>
            </div>

            <div>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorStateChange}
                />
            </div>
            <button className={`${cx('button')} mt-5`} onClick={handleClick} disabled={!title && !categorySelect}>
                Đăng
            </button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{contentDialog?.type}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{contentDialog?.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateBlog;
