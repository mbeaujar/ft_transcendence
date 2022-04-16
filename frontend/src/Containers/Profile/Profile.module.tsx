import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import Stats from './components/Stats/Stats';
import Friends from './components/Friends/Friends';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Settings from './components/Settings/Settings.module';
import classes from './Profile.module.scss';
import styles from './Profile.module.scss';
import Avatar from './components/Avatar/Avatar';
import { IUser } from '../../interface/user.interface';
import { IFriends } from '../../interface/friends.interface';

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: any;
}

const Profile: React.FC<Props> = (props: Props): JSX.Element => {
  const [activeMenu, setActiveMenu] = useState<string>('Stats');
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
    props.setRefresh(props.refresh + 1);
  }, [refresh]);

  const ftIsActiveMenu: any = (menuName: string) => {
    if (menuName === activeMenu) {
      return classes.activeMenu;
    }
    return classes.disactiveMenu;
  };

  const ftIsActiveInfo: any = (infoName: string) => {
    if (infoName === activeMenu) {
      return classes.activeInfo;
    }
    return classes.disactiveInfo;
  };

  return (
    <div className={clsx(classes.Profile)}>
      <div className={classes.ProfileLeft}>
        <div className={classes.User}>
          <Avatar user={props.user} />
          <h1>{props.user?.username}</h1>
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
            className={clsx(classes.Leaderboard, ftIsActiveMenu('Leaderboard'))}
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
      </div>

      <div className={clsx(classes.FriendsInfo, ftIsActiveInfo('Stats'))}>
        <Stats user={props.user} />
      </div>

      <div className={clsx(classes.FriendsInfo, ftIsActiveInfo('Friends'))}>
        <Friends />
      </div>

      <div
        className={clsx(classes.LeaderboardInfo, ftIsActiveInfo('Leaderboard'))}
      >
        <Leaderboard />
      </div>

      <div className={clsx(classes.SettingsInfo, ftIsActiveInfo('Settings'))}>
        <Settings user={props.user} refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};
export default Profile;
