import React, { useEffect, useState } from 'react';
import api from '../apis/api';
import clsx from 'clsx';
import Friends from './components/Friends.module';
import classes from './Profile.module.scss';
import Avatar from './components/Avatar.module';
import { IUser } from './interface/user.interface';

interface Props {
  user: IUser;
}

const Profile: React.FC<Props> = (props: Props): JSX.Element => {
  const [user, setUser] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string>('Stats');

  function ftShowProfile(user: any) {
    // if (user === null) {
    //   return classes.hideProfile;
    // }
    return classes.showProfile;
  }

  function ftShowUnauthorized(user: any) {
    // if (user === null) {
    //   return classes.showUnauthorized;
    // }
    return classes.hideUnauthorized;
  }

  // useEffect(() => {
  //   api
  //     .get('/auth/status')
  //     .then(response => {
  //       console.log('user', response.data);
  //       setUser(response.data);
  //     })
  //     .catch(reject => console.error(reject));
  // }, []);

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
    <div className={clsx(classes.Profile, ftShowProfile(props.user))}>
      <div className={classes.User}>
        <Avatar user={props.user} />
        <h1>{props.user?.username}</h1>
      </div>
      <div className={classes.Menu}>
        <p
          className={clsx(classes.History, ftIsActiveMenu('History'))}
          onClick={() => setActiveMenu('History')}
        >
          History
        </p>
        <p
          className={clsx(classes.Stats, ftIsActiveMenu('Stats'))}
          onClick={() => setActiveMenu('Stats')}
        >
          Stats
        </p>
        <p
          className={clsx(classes.Friends, ftIsActiveMenu('Friends'))}
          onClick={() => setActiveMenu('Friends')}
        >
          Friends
        </p>
      </div>

      <div className={clsx(classes.HistoryInfo, ftIsActiveInfo('History'))}>
        <h1>History</h1>
      </div>

      <div className={clsx(classes.StatsInfo, ftIsActiveInfo('Stats'))}>
        <p className={classes.Victory}>{props.user?.wins} victory</p>
        <p className={classes.Defeats}>{props.user?.losses} defeats</p>
        <p className={classes.Rank}>Rank : 2{/*user?.rank*/} </p>
        <p className={classes.Level}>Level : 1{/*user?.level*/} </p>
        {/*<div className={classes.facts}>{user?.facts}</p>*/}
      </div>

      <div className={clsx(classes.FriendsInfo, ftIsActiveInfo('Friends'))}>
        <Friends />
      </div>
    </div>
  );
};
export default Profile;
