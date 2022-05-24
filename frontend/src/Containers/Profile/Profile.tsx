import { useEffect, useState, Fragment } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import Stats from './components/Stats/Stats';
import Friends from './components/Friends/Friends';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Settings from './components/Settings/Settings';
import classes from './Profile.module.scss';
// import styles from "./Profile.module.scss";
import Avatar from './components/Avatar/Avatar';
import { IUser } from '../../interface/user.interface';
import ProfileLeft from './components/ProfileLeft/ProfileLeft';
// import { IFriends } from "../../interface/friends.interface";

interface Props {
  menu: string;
}
function Profile(props: Props) {
  // const [activeMenu, setActiveMenu] = useState<string>('Stats');
  const [refresh, setRefresh] = useState<number>(0);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    /*props.setRefresh(props.refresh + 1);*/
    api
      .get('/auth/status')
      .then((response) => setUser(response.data))
      .catch((reject) => console.error(reject));
  }, [refresh]);

  // const ftIsActiveMenu = (menuName: string) => {
  //   if (menuName === activeMenu) {
  //     return classes.activeMenu;
  //   }
  //   return classes.disactiveMenu;
  // };

  // const ftIsActiveInfo = (infoName: string) => {
  //   if (infoName === activeMenu) {
  //     return classes.activeInfo;
  //   }
  //   return classes.disactiveInfo;
  // };

  return (
    <Fragment>
      {user ? (
        <div className={clsx(classes.Profile)}>
          <ProfileLeft user={user} menu={props.menu} />
          {/* <div className={classes.ProfileLeft}>
            <div className={classes.User}>
              <Avatar user={user} />
              <h1>{user?.username}</h1>
            </div>
            <div className={classes.Menu}>
              <div
                className={clsx(classes.Stats, ftIsActiveMenu('Stats'))}
                onClick={() => setActiveMenu('Stats')}
              >
                <span className="material-icons">show_chart</span>
                <p>Stats</p>
              </div>
              <div
                className={clsx(classes.Friends, ftIsActiveMenu('Friends'))}
                onClick={() => setActiveMenu('Friends')}
              >
                <span className="material-icons">people_outline</span>
                <p>Friends</p>
              </div>
              <div
                className={clsx(
                  classes.Leaderboard,
                  ftIsActiveMenu('Leaderboard'),
                )}
                onClick={() => setActiveMenu('Leaderboard')}
              >
                <span className="material-icons">leaderboard</span>
                <p>Leaderboard</p>
              </div>
              <div
                className={clsx(classes.Settings, ftIsActiveMenu('Settings'))}
                onClick={() => setActiveMenu('Settings')}
              >
                <span className="material-icons">settings</span>
                <p>Settings</p>
              </div>
            </div>
          </div> */}

          {props.menu === 'Stats' ? (
            <div className={clsx(classes.FriendsInfo)}>
              <Stats user={user} />
            </div>
          ) : props.menu === 'Friends' ? (
            <div className={clsx(classes.FriendsInfo)}>
              <Friends />
            </div>
          ) : props.menu === 'Leaderboard' ? (
            <div className={clsx(classes.LeaderboardInfo)}>
              <Leaderboard />
            </div>
          ) : props.menu === 'Settings' ? (
            <div className={clsx(classes.SettingsInfo)}>
              <Settings user={user} refresh={refresh} setRefresh={setRefresh} />
            </div>
          ) : null}

          {/* <div className={clsx(classes.FriendsInfo)}>
            <Friends />
          </div>

          <div className={clsx(classes.LeaderboardInfo)}>
            <Leaderboard />
          </div>

          <div className={clsx(classes.SettingsInfo)}>
            <Settings user={user} refresh={refresh} setRefresh={setRefresh} />
          </div> */}
        </div>
      ) : null}
    </Fragment>
  );
}

export default Profile;
