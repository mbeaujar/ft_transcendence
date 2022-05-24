import React, { useState } from 'react';
import clsx from 'clsx';
import { IUser } from '../../../../interface/user.interface';
import classes from './ProfileLeft.module.scss';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

interface Props {
  user: IUser;
  menu: string;
  // ftIsActiveMenu:any;
  // setActiveMenu:any;
}

function ProfileLeft(props: Props) {
  //const [activeMenu, setActiveMenu] = useState<string>('Stats');

  const ftIsActiveMenu = (menuName: string) => {
    if (menuName === props.menu) {
      return classes.activeMenu;
    }
    return classes.disactiveMenu;
  };

  return (
    <div className={classes.ProfileLeft}>
      <div className={classes.User}>
        <Avatar user={props.user} />
        <h1>{props.user?.username}</h1>
      </div>
      <div className={classes.Menu}>
        <Link
          to="/profile/stats"
          className={clsx(
            classes.DivMenu,
            classes.Stats,
            ftIsActiveMenu('Stats'),
          )}
        >
          <span className="material-icons">show_chart</span>
          <p>Stats</p>
        </Link>
        <Link
        to="/profile/friends"
          className={clsx(
            classes.DivMenu,
            classes.Friends,
            ftIsActiveMenu('Friends'),
          )}
        >
          <span className="material-icons">people_outline</span>
          <p>Friends</p>
        </Link>
        <Link
        to="/profile/leaderboard"
          className={clsx(
            classes.DivMenu,
            classes.Leaderboard,
            ftIsActiveMenu('Leaderboard'),
          )}
        >
          <span className="material-icons">leaderboard</span>
          <p>Leaderboard</p>
        </Link>
        <Link
        to="/profile/settings"
          className={clsx(
            classes.DivMenu,
            classes.Settings,
            ftIsActiveMenu('Settings'),
          )}
        >
          <span className="material-icons">settings</span>
          <p>Settings</p>
        </Link>
      </div>
    </div>
  );
}

export default ProfileLeft;
