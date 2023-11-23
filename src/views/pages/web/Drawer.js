import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useState, useEffect } from 'react';
import Chat from './Chat';
function DrawerCustom({ openDrawer, onSetOpenDrawer, idCourse }) {
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        onSetOpenDrawer(open);
    };
    return (
        <>
            <Drawer anchor={'right'} open={openDrawer || false} onClose={toggleDrawer(false)}>
                <Box sx={{ width: '500px' }} role="presentation">
                    <Chat idCourse={idCourse} />
                </Box>
            </Drawer>
        </>
    );
}

export default DrawerCustom;
