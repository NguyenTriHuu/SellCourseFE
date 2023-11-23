import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DrawerCustom from './Drawer';
import { useState, useEffect } from 'react';
const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    color: '#49bdb7f7',
};

const fab = {
    color: '#49bdb7f7',
    sx: fabStyle,
    icon: <SupportAgentIcon sx={{ mr: 1 }} />,
    label: 'Add',
};

function Assistant({ idCourse }) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const handleClick = (e) => {
        e.stopPropagation();
        setOpenDrawer(true);
    };
    const onSetOpenDrawer = (open) => {
        setOpenDrawer(open);
    };
    return (
        <>
            <Fab variant="extended" sx={fab.sx} aria-label={fab.label} color="inherit" onClick={handleClick}>
                {fab.icon}
                Assistant
            </Fab>
            <DrawerCustom openDrawer={openDrawer} onSetOpenDrawer={onSetOpenDrawer} idCourse={idCourse} />
        </>
    );
}

export default Assistant;
