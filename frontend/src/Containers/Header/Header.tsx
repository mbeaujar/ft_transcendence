import React, { ClassAttributes, useContext, useEffect, useState } from 'react';
import classes from './Header.module.scss';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import api from '../../apis/api';
import clsx from 'clsx';
import { IUser } from '../../interface/user.interface';
import { UserContext } from '../../context';

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

const LoginBtn = ({ onClick }: { onClick: () => void }) => (
  <Button className={classes.showLogin} text="LOGIN" onClick={onClick} />
);

const LogoutBtn = ({ onClick }: { onClick: () => void }) => (
  <Button className={classes.showLogout} text="LOGOUT" onClick={onClick} />
);

function Header(props: any) {
  const [showLinks, setShowLinks] = useState(false);
  const { handleLogout, isLogged } = useContext(UserContext);


  function BurgerMenuMode() {
    if (showLinks === false) return classes.BurgerMenu;
    return classes.BurgerMenuCross;
  }

  function showNavigation() {
    if (window.innerWidth > 650.01) return classes.Nav;
    else {
      if (showLinks === false) return classes.HideNavigation;
      return classes.ShowNavigation;
    }
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
        {isLogged && (
          <>
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
          </>
        )}
        {!isLogged ? (
          <LoginBtn
            onClick={() =>
              (window.location.href = 'http://localhost:3000/api/auth/login')
            }
          />
        ) : (
          <LogoutBtn
            onClick={() => {
              if (handleLogout) handleLogout();
            }}
          />
        )}
      </nav>
    </div>
  );
}

export default Header;
