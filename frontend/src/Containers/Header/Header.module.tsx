import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { BrowserRouter as Router, Link } from "react-router-dom";
import api from "../../apis/api";
import clsx from "clsx";

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
  const [showLinks, setShowLinks] = useState(false);

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
      .get("/auth/status")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => setUser(null));
  }, []);

  function BurgerMenuMode() {
    if (showLinks == false) return classes.BurgerMenu;
    return classes.BurgerMenuCross;
  }

  function showNavigation() {
    if (window.innerWidth > 650.01) return classes.Nav;
    else {
      if (showLinks == false) return classes.HideNavigation;
      return classes.ShowNavigation;
    }
  }

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
          to="/profile"
          className={clsx(classes.Link, classes.Profile)}
          onClick={() => setShowLinks(!showLinks)}
        >
          PROFILE
        </Link>
        <Button
          className={ftShowLogin(user)}
          text="LOGIN"
          onClick={() => {
            window.location.href = "http://localhost:3000/api/auth/login";
          }}
        />
        <Button
          className={ftShowLogout(user)}
          text="LOGOUT"
          onClick={() => {
            window.location.href = "http://localhost:3000/api/auth/logout";
          }}
        />
      </nav>
    </div>
  );
}

export default Header;
