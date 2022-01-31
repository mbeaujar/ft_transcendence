import React from 'react';
import classes from './Layout.module.css';


function Layout(props) {
    return (
        <div className={classes.Layout}>
            <header/>
            {props.children}
        </div>
    );
}

export default Layout;