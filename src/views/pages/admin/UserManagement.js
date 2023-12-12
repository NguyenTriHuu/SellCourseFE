import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'src/axios/axios';
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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Tên tài khoản', width: 200 },
    { field: 'fullname', headerName: 'Tên đầy đủ', width: 150 },
    {
        field: 'dateOfBirth',
        headerName: 'Ngày sinh',
        type: 'time',
        width: 150,
    },
    {
        field: 'locked',
        headerName: 'Tình trạng',
        valueGetter: (params) => (params.row.locked ? 'Locked' : 'UnLocked'),
    },
    {
        field: 'roles',
        headerName: 'Vai trò',
        valueGetter: (params) => params.row.roles.map((role) => role.name).join(', '),
        width: 150,
    },
    {
        field: 'active',
        headerName: 'Hoạt động',
        valueGetter: (params) => (params.row.active ? moment(params.row.active).fromNow() : null),
        width: 150,
    },
];

function UserManagement() {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [select, setSelect] = useState([]);
    const [userUpdate, setUserUpdate] = useState();
    const [openModalRole, setOpenModalRole] = useState(false);
    const [messageErrorBlankRole, setMessageErrorBlankRole] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [suggester, setSuggester] = useState([]);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const handleCloseModalRole = () => setOpenModalRole(false);
    useEffect(() => {
        axiosPrivate
            .get('/api/users')
            .then((res) => setUsers(res?.data))
            .catch((error) => console.log(error));
    }, [userUpdate]);

    const handleLock = (value1, value2) => {
        axiosPrivate
            .post(`/api/user/${value1}/change-status`, value2, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => setUserUpdate(res?.data))
            .catch((error) => console.log(error));
    };

    const handleChangeRole = (value) => {
        let roles = [];
        users
            .find((item) => item?.id === value)
            ?.roles.map((role) => {
                roles.push(role?.name);
            });
        setRoleName([...roles]);
        setOpenModalRole(true);
    };
    const [roleName, setRoleName] = useState([]);

    const handleChangeRoleName = (event) => {
        const {
            target: { value },
        } = event;
        setRoleName(typeof value === 'string' ? value.split(',') : value);
    };

    const handleClickChangeRole = () => {
        setOpenBackdrop(true);
        if (roleName === null) {
            setMessageErrorBlankRole('Vai trò không được rỗng');
            let roles = [];
            users
                .find((item) => item?.id === value)
                ?.roles.map((role) => {
                    roles.push(role?.name);
                });
            setRoleName([...roles]);
            setOpenBackdrop(false);
            return;
        }

        let roles = [];
        users
            .find((item) => item?.id === select[0])
            ?.roles.map((role) => {
                roles.push(role?.name);
            });
        if (roles.length === roleName.length && roles.every((value) => roleName.includes(value))) {
            setOpenModalRole(false);
            setOpenBackdrop(false);
            return;
        }
        axiosPrivate
            .post(`/api/user/${select[0]}/change-role`, roleName, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                setOpenBackdrop(false);
                setOpenModalRole(false);
                setUserUpdate(res?.data);
            })
            .catch((error) => {
                setOpenBackdrop(false);
                setOpenModalRole(false);
                console.log(error);
            });
    };
    const [searchText, setSearchText] = useState('');
    const handleClickSearch = () => {
        if (searchText === '') {
            axiosPrivate
                .get('/api/search/user', { params: { search: inputValue } })
                .then((res) => setUsers(res?.data))
                .catch((error) => console.log(error));
        } else {
            axiosPrivate
                .get('/api/search/user', { params: { search: searchText } })
                .then((res) => setUsers(res?.data))
                .catch((error) => console.log(error));
        }
    };
    const [inputValue, setInputValue] = useState('');
    console.log(searchText);
    console.log(inputValue);

    const handleChangeSearchText = (event, newValue) => {
        setSearchText(newValue);
    };

    const handleInputChange = async (e, newInputValue) => {
        setInputValue(newInputValue);
        try {
            const { data } = await axios.get('http://localhost:9200/user/_search', {
                params: {
                    source: JSON.stringify({
                        query: {
                            multi_match: {
                                query: newInputValue,
                                type: 'best_fields',
                                fields: ['username.autocomplete', 'fullname.autocomplete', 'rolename.autocomplete'],
                                fuzziness: 'AUTO',
                            },
                        },
                        highlight: {
                            fields: {
                                'username.autocomplete': {},
                                'fullname.autocomplete': {},
                                'rolename.autocomplete': {},
                            },
                        },
                    }),
                    source_content_type: 'application/json',
                },
            });
            setSuggester(
                Array.from(
                    new Set(
                        data.hits.hits.map((item) => {
                            const highlight = item.highlight;
                            const fields = Object.keys(highlight);
                            const matchedValue = highlight[fields[0]][0];
                            const cleanMatchedValue = matchedValue.replace(/<em>|<\/em>/g, '');
                            return cleanMatchedValue;
                        }),
                    ),
                ),
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="grid">
                <div className="row">
                    <div className="flex rounded-lg p-1 ml-5 flex-row justify-between">
                        <div className="flex h-fit">
                            <Autocomplete
                                sx={{ width: '400px', alignSelf: 'center' }}
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                value={searchText}
                                onChange={(event, newValue) => handleChangeSearchText(event, newValue)}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    handleInputChange(event, newInputValue);
                                }}
                                options={suggester.map((option) => option)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                            placeholder: 'Search text .....',
                                        }}
                                    />
                                )}
                            />
                            <input
                                onClick={handleClickSearch}
                                type="button"
                                value="Search"
                                className=" bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-blue-800 transition-colors"
                            />
                        </div>
                        <div className="mr-10">
                            <MenuAction
                                data={select}
                                onHandleLock={handleLock}
                                onChangeRole={handleChangeRole}
                                lock={users && users.find((item) => item?.id === select[0])?.locked}
                            />
                        </div>
                    </div>
                </div>
                <DataGrid
                    rows={users}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelect(newRowSelectionModel);
                    }}
                    rowSelectionModel={select}
                    disableRowSelectionOnClick
                />
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openModalRole}
                    onClose={handleCloseModalRole}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openModalRole}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Đổi vai trò
                            </Typography>
                            <Select
                                sx={{ width: '100%' }}
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={roleName}
                                onChange={handleChangeRoleName}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={roleName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            <div className="flex justify-end mt-3">
                                <Button variant="outlined" sx={{ marginRight: '10px' }}>
                                    Hủy
                                </Button>
                                <Button variant="contained" onClick={handleClickChangeRole}>
                                    Thay đổi
                                </Button>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                    onClick={handleCloseBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    );
}

function MenuAction({ data, onHandleLock, onChangeRole, lock }) {
    console.log('re-render');
    console.log(lock);
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
        onHandleLock(data[0], true);
    };
    const handleUnLock = () => {
        setAnchorEl(null);
        onHandleLock(data[0], false);
    };
    const handleChangeRole = () => {
        setAnchorEl(null);
        onChangeRole(data[0]);
    };
    const handleReview = () => {
        setAnchorEl(null);
        navigate('');
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
                <MenuItem onClick={handleLock} disableRipple disabled={(data && data.length !== 1) || lock}>
                    <EditIcon />
                    Chặn
                </MenuItem>

                <MenuItem onClick={handleUnLock} disableRipple disabled={(data && data.length !== 1) || !lock}>
                    <EditIcon />
                    Mở chặn
                </MenuItem>

                <MenuItem onClick={handleChangeRole} disableRipple disabled={data && data.length === 0}>
                    <FileCopyIcon />
                    Đổi vai trò
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem disableRipple disabled={data && data.length !== 1} onClick={handleReview}>
                    <FileCopyIcon />
                    Xem hồ sơ
                </MenuItem>
            </StyledMenu>
        </>
    );
}

export default UserManagement;
