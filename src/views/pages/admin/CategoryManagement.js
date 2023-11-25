import styles from './scss/Category.module.scss';
import classNames from 'classnames/bind';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect, useRef, forwardRef } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CateGoryManagement() {
    const cx = classNames.bind(styles);
    const [categories, setCategory] = useState([]);
    const [select, setSelect] = useState([]);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openDiaLog, setOpenDiaLog] = useState(false);
    const [message, setMessage] = useState('');
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name Category', width: 130 },
        { field: 'code', headerName: 'Code', width: 130 },
    ];

    useEffect(() => {
        axiosPrivate
            .get('/api/category/all')
            .then((res) => setCategory([...res?.data]))
            .catch((error) => console.log(error));
    }, []);

    const fetchSave = async (dataSave) => {
        try {
            const { data } = await axiosPrivate.post('/api/category/save', dataSave, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let temp = categories.filter((category) => category?.id !== data?.id);
            temp = [...temp, { id: data?.id, name: data?.name, code: data?.code }];
            setCategory([...temp]);
            setSelect([]);
            setName('');
            setCode('');
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = async (e) => {
        e.stopPropagation();
        let dataSave = { id: select[0], name: name, code: code };
        await fetchSave(dataSave);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setAnchorEl(null);
        await fetchCheckDelete();
    };

    const fetchCheckDelete = async () => {
        let ids = [...select];
        try {
            const { data } = await axiosPrivate.post('/api/category/check', ids, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (data === 'ok') {
                /* try {
                    const response = await axiosPrivate.post('/api/category/delete', ids, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    console.log(error);
                }*/
            } else {
                setMessage(data);
                setOpenDiaLog(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = () => {
        setAnchorEl(null);
        let cate = categories.find((item) => item?.id === select[0]);
        setName(cate?.name);
        setCode(cate?.code);
    };

    const handleAdd = () => {
        setAnchorEl(null);
        setName('');
        setCode('');
        setSelect([]);
    };

    const handleCloseBD = () => {
        setOpenBackdrop(false);
    };

    const handleCloseDiaLog = () => {
        setOpenDiaLog(false);
    };

    return (
        <div className="grid">
            <div className="row">
                <div className="col l-5">
                    <h1 className="ml-3 font-sans tracking-wide">Add new Category</h1>
                    <div className="p-5">
                        <p className="text-xl font-sans tracking-wide text-black">Category Name:</p>
                        <input
                            placeholder="Searth the internet..."
                            type="text"
                            id="categoryName"
                            name="name"
                            className={cx('input')}
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                        <p className="mt-4 text-xl font-sans tracking-wide text-black">Code:</p>
                        <input
                            placeholder="Searth the internet..."
                            type="text"
                            id="categoryCode"
                            name="code"
                            className={cx('input')}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        ></input>
                        <Button
                            sx={{ marginTop: '20px' }}
                            variant="contained"
                            disabled={name === '' || code === ''}
                            onClick={(e) => handleClick(e)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                <div className="col l-7">
                    <div>
                        <Button
                            id="fade-button"
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClickMenu}
                        >
                            Actions
                        </Button>
                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem disabled={select && select.length !== 0} onClick={handleAdd}>
                                Add new
                            </MenuItem>
                            <MenuItem disabled={select && select.length !== 1} onClick={handleUpdate}>
                                Edit
                            </MenuItem>
                            <MenuItem disabled={select && select.length < 1} onClick={handleDelete}>
                                Delete
                            </MenuItem>
                        </Menu>
                    </div>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={categories}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setSelect(newRowSelectionModel);
                            }}
                            rowSelectionModel={select}
                            disableRowSelectionOnClick
                        />
                    </div>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                        onClick={handleCloseBD}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Dialog
                        open={openDiaLog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseDiaLog}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>{'Warning'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
                            <DialogContentText id="alert-dialog-slide-description2" style={{ marginTop: '10px' }}>
                                Please consider, once deleted, data cannot be restored
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDiaLog}>Disagree</Button>
                            <Button onClick={handleCloseDiaLog}>Agree</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default CateGoryManagement;
