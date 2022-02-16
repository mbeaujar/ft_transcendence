import React, { useEffect, useState } from 'react';
import classes from './Header.module.scss';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import api from '../apis/api';

const Button = (props: any) => {
  return (
    <div>
      <button className={props.className} onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  );
};

function Header() {
  const [user, setUser] = useState<any>(null);

  function ftShowLogin(user: any) {
    if (user === null) {
      return classes.showLogin;
    }
    return classes.hideLogin;
  }

  function ftShowLogout(user: any) {
    if (user === null) {
      return classes.hideLogout;
    }
    return classes.showLogout;
  }

  useEffect(() => {
    api
      .get('/auth/status')
      .then(response => {
        setUser(response.data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <div className={classes.Header}>
      <h1>PONGAME</h1>
      <nav className={classes.Navigation}>
        <Link to="/Game">GAME</Link>
        <Link to="/Chat">CHAT</Link>
        <Link to="/Profile">PROFILE</Link>
        <Button
          className={ftShowLogin(user)}
          text="LOGIN"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/login';
          }}
        />
        <Button
          className={ftShowLogout(user)}
          text="LOGOUT"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/logout';
          }}
        />
      </nav>
    </div>
  );
}

export default Header;
