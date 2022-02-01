import React from 'react';
import classes from './Header.module.scss';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function Header() {

    
    return (
        <div className={classes.Header}>
            <h1>PONGAME</h1>
            <div className={classes.Navigation}>
                <Router>
                    <Link onClick={window.location.reload} to="/Game">GAME</Link>
                    <Link onClick={window.location.reload} to="/Chat">CHAT</Link>
                    <Link onClick={window.location.reload} to="/Profile">PROFILE</Link>
                </Router>
            </div>
        </div>
    );
}

export default Header;