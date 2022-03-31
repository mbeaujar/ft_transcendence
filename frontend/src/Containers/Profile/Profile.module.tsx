import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import Friends from './components/Friends/Friends.module';
import Leaderboard from './components/Leaderboard/Leaderboard.module';
import Settings from './components/Settings/Settings.module';
import classes from './Profile.module.scss';
import styles from './Profile.module.scss';
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

  let valuePongopoints: any = document.getElementById(styles.valuePongopoints);
  let progressPongopoints = 0;
  let speed = 1;
  let progress2 = setInterval(() => {
    progressPongopoints++;
    if (valuePongopoints != null) {
      valuePongopoints.textContent = `${progressPongopoints}`;
    }

    if (progressPongopoints >= 561) {
      clearInterval(progress2);
    }
  }, speed);

  let progressBar: any = document.getElementById(styles.circular_progress);
  let progressValue = 0;
  let progressEndValue = 30;
  speed = 20;

  let progress = setInterval(() => {
    progressValue++;
    if (progressBar != null) {
      progressBar.style.background = `conic-gradient(
        red ${progressValue * 3.6}deg,
        #000000 ${progressValue * 3.6}deg
        )`;
      if (progressValue >= progressEndValue) {
        progressBar.style.background = `conic-gradient(
            red 0deg,
            red ${progressEndValue * 3.6}deg,
            #4bec00 ${progressEndValue * 3.6}deg,
            #4bec00 ${progressValue * 3.6}deg,
            rgb(0, 0, 0) ${progressValue * 3.6}deg,
            rgb(0, 0, 0) 360deg
            )`;
      }
    }
    if (progressValue == 100) {
      clearInterval(progress);
    }
  }, speed);

  let podium2: any = document.getElementById(styles.Podium2);
  let podium1: any = document.getElementById(styles.Podium1);
  let podium3: any = document.getElementById(styles.Podium3);

  let podium2Progress = 0;
  let podium3Progress = 0;
  let podium1Progress = 0;

  speed = 30;
  let progressPodium2 = setInterval(() => {
    podium2Progress++;
    if (podium2 != null) {
      podium2.style.height = `${podium2Progress}%`;
    }
    if (podium2Progress == 45) {
      clearInterval(progressPodium2);
    }
  }, speed);
  let progressPodium1 = setInterval(() => {
    podium1Progress++;
    if (podium1 != null) {
      podium1.style.height = `${podium1Progress}%`;
    }
    if (podium1Progress == 60) {
      clearInterval(progressPodium1);
    }
  }, speed);
  let progressPodium3 = setInterval(() => {
    podium3Progress++;
    if (podium3 != null) {
      podium3.style.height = `${podium3Progress}%`;
    }
    if (podium3Progress == 30) {
      clearInterval(progressPodium3);
    }
  }, speed);

  let imgLevelElementProgress = 0;
  let imgLevelElement: any = document.getElementById(styles.imgLevelElement);
  let progressPodium4 = setInterval(() => {
    imgLevelElementProgress++;
    if (imgLevelElement != null) {
      imgLevelElement.style.width = `${imgLevelElementProgress}%`;
    }
    if (imgLevelElementProgress == 55) {
      clearInterval(progressPodium4);
    }
  }, speed);

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
              <h4 id={styles.valuePongopoints}></h4>
            </div>
            <div className={classes.Bottom}>
              <p>PONGOPOINTS</p>
            </div>
          </div>
          <div className={classes.Ratio}>
            <div className={classes.Top}>
              <div className={classes.container}>
                <div id={styles.circular_progress}></div>
              </div>
            </div>
            <div className={classes.Bottom}>
              <p>
                <span className={classes.Wins}>7 wins</span> /{' '}
                <span className={classes.Losses}>3 losses</span>
              </p>
            </div>
          </div>
          <div className={classes.Rank}>
            <div className={classes.Top}>
              <div id={styles.Podium2}></div>
              <div id={styles.Podium1}></div>
              <div id={styles.Podium3}></div>
            </div>
            <div className={classes.Bottom}>
              <p>8</p>
              <span>th</span>
            </div>
          </div>
          <div className={classes.Level}>
            <div className={classes.Top}>
              <img
                id={styles.imgLevelElement}
                src={imgLevel.get('Elite 1')}
              ></img>
            </div>
            <div className={classes.Bottom}>
              <p>ELITE 1</p>
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
                  <div className={classes.friendsListElement} >
                      <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_ZFA7Nc5_IkQinevA7dBIwquje91csViyQ&usqp=CAU"/></div>
                      <p>Eren</p>
                    </div>
                    <div className={classes.friendsListElement} >
                      <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"/></div>
                      <p>Livaï</p>
                    </div>
                    <div className={classes.friendsListElement} >
                      <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyhWqTEVwIMyW5Mx90y44YZjlkPVH-dm908g&usqp=CAU"/></div>
                      <p>Erwin</p>
                    </div>
                    <div className={classes.friendsListElement} >
                      <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU"/></div>
                      <p>Rick</p>
                    </div>
                    <div className={classes.friendsListElement} >
                      <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQww5NXS3n-jtIJeol6l462l_Nl-X9BUH6vLw&usqp=CAU"/></div>
                      <p>Jon</p>
                    </div>
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
