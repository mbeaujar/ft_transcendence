import React, { useEffect, useState, useRef } from 'react';
import api from '../../../../apis/api';
import clsx from 'clsx';
import classes from './Stats.module.scss';
import styles from './Stats.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IFriends } from '../../../../interface/friends.interface';
import Avatar from '../../components/Avatar/Avatar.module';
import Pongopoints from './Components/Pongopoints/Pongopoints';
import Ratio from './Components/Ratio/Ratio';
import Rank from './Components/Rank/Rank';
import Level from './Components/Level/Level';
import HistoryBlock from './Components/HistoryBlock/HistoryBlock';
import FriendsBlock from './Components/FriendsBlock/FriendsBlock';

interface Props {
  user: IUser;
}

const Stats: React.FC<Props> = (props: Props): JSX.Element => {
  const [friendsList, setFriendsList] = useState<IFriends>();

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
  }, []);

  return (
    <div className={classes.Stats}>
      <div className={classes.StatsGeneral}>
        <Pongopoints />
        <Ratio />
        <Rank />
        <Level />
      </div>
      <div className={classes.Bottom}>
        <HistoryBlock />
        <FriendsBlock />
        {/*<div className={classes.FriendsBlock}>
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
                <div className={classes.friendsListElement}>
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_ZFA7Nc5_IkQinevA7dBIwquje91csViyQ&usqp=CAU" />
                  </div>
                  <p>Eren</p>
                </div>
                <div className={classes.friendsListElement}>
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU" />
                  </div>
                  <p>Livaï</p>
                </div>
                <div className={classes.friendsListElement}>
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyhWqTEVwIMyW5Mx90y44YZjlkPVH-dm908g&usqp=CAU" />
                  </div>
                  <p>Erwin</p>
                </div>
                <div className={classes.friendsListElement}>
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU" />
                  </div>
                  <p>Rick</p>
                </div>
                <div className={classes.friendsListElement}>
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQww5NXS3n-jtIJeol6l462l_Nl-X9BUH6vLw&usqp=CAU" />
                  </div>
                  <p>Jon</p>
                </div>
              </div>
            )}
          </div>
        </div>*/}
      </div>
    </div>
  );
};
export default Stats;
