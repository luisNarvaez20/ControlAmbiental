import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const DrawerIndicador = ({ anchor, open, toggleDrawer, content}) => {
    return (
        <SwipeableDrawer
            anchor={anchor}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <div
                role="presentation"
                style={{ width: 400, padding: 16 }}
                onClick={(event) => event.stopPropagation()}
            >
                {content}
            </div>
        </SwipeableDrawer>
    );
};

export default DrawerIndicador;