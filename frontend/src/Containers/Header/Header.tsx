import React, { useEffect, useState } from 'react';
import classes from './Header.module.scss';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import api from '../../apis/api';
import clsx from 'clsx';
import { IUser } from '../../interface/user.interface';

interface Props {
  className: string;
  text: string;
  onClick: () => void;
}
const Button = (props: Props) => {
  return (
    <div>
      <button className={props.className} onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  );
};

function Header(props: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [showLinks, setShowLinks] = useState(false);

  function ftShowLogin(user: IUser | null) {
    if (props.show === 2) return classes.hideLogin;
    if (user === null) {
      return classes.showLogin;
    }
    return classes.hideLogin;
  }

  function ftShowLogout(user: IUser | null) {
    if (user === null && props.show !== 2) {
      return classes.hideLogout;
    }
    return classes.showLogout;
  }

  useEffect(() => {
    api
      .get('/auth/status')
      .then((response) => {
        setUser(response.data);
        //console.log("gameresponse=",response.data)
      })
      .catch(() => setUser(null));
  }, []);

  function BurgerMenuMode() {
    if (showLinks === false) return classes.BurgerMenu;
    return classes.BurgerMenuCross;
  }

  function showNavigation() {
    if (showLinks === false) return classes.HideNavigation;
    return classes.ShowNavigation;
  }

  useEffect(() => {
    if (showLinks === true && window.innerWidth < 650.01) {
      $('body').css('overflow-y', 'hidden');
      $('.Header').css('overflow-y', 'visible');
    } else {
      $('body').css('overflow-y', 'visible');
    }
  }, [showLinks]);

  return (
    <div className={classes.Header}>
      <h1>PONGAME</h1>
      <div
        className={BurgerMenuMode()}
        onClick={() => setShowLinks(!showLinks)}
      >
        <div className={classes.BurgerMenuTop}></div>
        <div className={classes.BurgerMenuMiddle}></div>
        <div className={classes.BurgerMenuBottom}></div>
      </div>
      <nav className={clsx(classes.Navigation, showNavigation())}>
        <Link
          to="/game"
          className={clsx(classes.Link, classes.Game)}
          onClick={() => setShowLinks(!showLinks)}
        >
          GAME
        </Link>
        <Link
          to="/chat"
          className={clsx(classes.Link, classes.Chat)}
          onClick={() => setShowLinks(!showLinks)}
        >
          CHAT
        </Link>
        <Link
          to="/profile/stats"
          className={clsx(classes.Link, classes.Profile)}
          onClick={() => setShowLinks(!showLinks)}
        >
          PROFILE
        </Link>
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
