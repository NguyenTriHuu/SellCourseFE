import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from 'react-router-dom';
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

function MenuCourse({ handleDelete, data, onlock, lock }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const location = useLocation();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget);
    };
    const handleDeleteIn = () => {
        setAnchorEl(null);
        handleDelete;
    };

    const handleEdit = () => {
        setAnchorEl(null);
        console.log(data[0]);
        navigate('/admin/editcourse/add', { state: { idCourse: data[0] } });
    };
    const handleAdd = () => {
        setAnchorEl(null);
        navigate('/admin/editcourse/add');
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlelock = () => {
        setAnchorEl(null);
        onlock && onlock(data[0], false);
    };

    const handleUnlock = () => {
        setAnchorEl(null);
        onlock && onlock(data[0], true);
    };

    return (
        <div>
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
                <MenuItem onClick={handleEdit} disableRipple disabled={data.length !== 1}>
                    <EditIcon />
                    Edit
                </MenuItem>

                <MenuItem onClick={handleDeleteIn} disableRipple disabled={data.length === 0}>
                    <FileCopyIcon />
                    Delete
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem disableRipple disabled={data.length > 0} onClick={handleAdd}>
                    <FileCopyIcon />
                    Add new
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handlelock} disableRipple disabled={data.length !== 1 || !lock}>
                    <EditIcon />
                    Lock
                </MenuItem>

                <MenuItem onClick={handleUnlock} disableRipple disabled={data.length !== 1 || lock}>
                    <FileCopyIcon />
                    Unlock the lock
                </MenuItem>
            </StyledMenu>
        </div>
    );
}
//<Divider sx={{ my: 0.5 }} />
export default React.memo(MenuCourse);
