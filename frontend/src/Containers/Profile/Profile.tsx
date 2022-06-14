import { useEffect, useState, Fragment } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import Stats from './components/Stats/Stats';
import Friends from './components/Friends/Friends';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Settings from './components/Settings/Settings';
import classes from './Profile.module.scss';
// import styles from "./Profile.module.scss";
import { IUser } from '../../interface/user.interface';
import ProfileLeft from './components/ProfileLeft/ProfileLeft';
// import { IFriends } from "../../interface/friends.interface";

interface Props {
  menu: string;
  theme: string;
  setTheme: (value: string) => void;
}
function Profile(props: Props) {
  const [refresh, setRefresh] = useState<number>(0);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get('/auth/status', {
        signal: controller.signal,
      })
      .then((response) => setUser(response.data))
      .catch((reject) => console.error(reject));

      return () => {
        controller.abort();
      };
  }, [refresh]);


  return (
    <Fragment>
      {user ? (
        <div className={clsx(classes.Profile)}>
          <ProfileLeft user={user} menu={props.menu} />
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
              <Settings
                user={user}
                refresh={refresh}
                setRefresh={setRefresh}
                theme={props.theme}
                setTheme={props.setTheme}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </Fragment>
  );
}

export default Profile;
