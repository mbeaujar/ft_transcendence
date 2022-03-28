import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import Friends from './components/Friends/Friends.module';
import Leaderboard from './components/Leaderboard/Leaderboard.module';
import Settings from './components/Settings/Settings.module';
import classes from './Profile.module.scss';
import Avatar from './components/Avatar/Avatar.module';
import { IUser } from '../../interface/user.interface';
import { IFriends } from '../../interface/friends.interface';

interface Props {
  user: IUser;
}

//site imgLevel : https://www.dexerto.es/fifa/recompensas-de-fifa-20-fut-champions-rangos-de-la-weekend-league-1101381/

const Profile: React.FC<Props> = (props: Props): JSX.Element => {
  const [activeMenu, setActiveMenu] = useState<string>('Stats');
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [refresh, setRefresh] = useState<number>(0);

  let imgLevel = new Map<string, string>();
  imgLevel.set(
    'Bronze 3',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-3-Rank.png'
  );
  imgLevel.set(
    'Bronze 2',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-2-Rank.png'
  );
  imgLevel.set(
    'Bronze 1',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-1-Rank.png'
  );
  imgLevel.set(
    'Silver 3',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-3-Rank.png'
  );
  imgLevel.set(
    'Silver 2',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-2-Rank.png'
  );
  imgLevel.set(
    'Silver 1',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-1-Rank.png'
  );
  imgLevel.set(
    'Gold 3',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-3-Rank.png'
  );
  imgLevel.set(
    'Gold 2',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-2-Rank.png'
  );
  imgLevel.set(
    'Gold 1',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-1-Rank.png'
  );
  imgLevel.set(
    'Elite 3',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-3-Rank.png'
  );
  imgLevel.set(
    'Elite 2',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-2-Rank.png'
  );
  imgLevel.set(
    'Elite 1',
    'https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-1-Rank.png'
  );

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
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

      <div className={clsx(classes.HistoryInfo, ftIsActiveInfo('History'))}>
        <h1>History</h1>
      </div>

      <div className={clsx(classes.StatsInfo, ftIsActiveInfo('Stats'))}>
        <div className={classes.StatsGeneral}>
          <div className={classes.Pongopoints}>
            <div className={classes.Top}>
              <h4>561</h4>
            </div>
            <div className={classes.Bottom}>
              <p>PONGOPOINTS</p>
            </div>
          </div>
          <div className={classes.Ratio}></div>
          <div className={classes.Rank}></div>
          <div className={classes.Level}>
            <div className={classes.Top}>
              <img src={imgLevel.get('Gold 2')}></img>
            </div>
            <div className={classes.Bottom}>
              <p>GOLD 2</p>
            </div>
          </div>
        </div>
        <div className={classes.Bottom}>
          <div className={classes.HistoryBlock}>
            <h3 className={classes.title}>History</h3>
            <div className={classes.Hitory}></div>
          </div>
          <div className={classes.FriendsBlock}>
            <h3 className={classes.title}>Friends</h3>
            <div className={classes.Friends}>
              {friendsList && (
                <div className={classes.list}>
                  {friendsList.friends.map((friend: IUser) => (
                    <div className={classes.friendsListElement} key={friend.id}>
                      <Avatar user={friend} />
                      <p>{friend.username}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
        <Settings />
      </div>
    </div>
  );
};
export default Profile;
