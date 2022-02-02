import React, { useEffect, useState } from 'react';
import classes from './Header.module.scss';
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from 'axios';

const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

const Button = (props: any) => {
    return (
        <div>
        <button className={props.className} onClick={props.onClick}>{props.text}</button>
        </div>
    );
};

function Header() {

    const [user, setUser] = useState<any>(null);

    function ftShowLogin(user:any)
    {
        console.log("user == " + user);
        if (user==null)
        {
            console.log("ok");
            return (classes.showLogin);
        }
        return (classes.hideLogin);
    }

    return (
        <div className={classes.Header}>
            <h1>PONGAME</h1>
            <div className={classes.Navigation}>
                <Router>
                    <Link onClick={window.location.reload} to="/Game">GAME</Link>
                    <Link onClick={window.location.reload} to="/Chat">CHAT</Link>
                    <Link onClick={window.location.reload} to="/Profile">PROFILE</Link>
                </Router>
                <Button className={ftShowLogin(user)} text="LOGIN" onClick={() => {window.location.href = 'http://localhost:3000/api/auth/login';apiAxios.get('/auth/status', 
                { withCredentials: true }).then(response => {console.log(response.data);
                        setUser(response.data);}).catch(() => setUser(null));}}/>
                <Button text="LOGOUT" onClick={() => {window.location.href = 'http://localhost:3000/api/auth/logout';}}/>
                <Button text="STATUS" onClick={() => {apiAxios.get('/auth/status', 
                { withCredentials: true }).then(response => {console.log(response.data);
                        setUser(response.data);}).catch(() => setUser(null));}}/>
            </div>
        </div>
    );
}

export default Header;