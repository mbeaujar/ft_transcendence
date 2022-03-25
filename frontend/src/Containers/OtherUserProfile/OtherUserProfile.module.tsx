import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import classes from './OtherUserProfile.module.scss';
import { IUser } from '../../interface/user.interface';
import { IFriends } from '../../interface/friends.interface';
import Avatar from '../Profile/components/Avatar/Avatar.module';

interface Props {
  user: IUser;
}

const OtherUserProfile: React.FC<Props> = (props: Props): JSX.Element => {
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
  }, [refresh]);

  return (
    <div className={classes.OtherUserProfile}>
      <div className={classes.OtherUserProfileLeft}>
        <Avatar user={props.user} />
        <h1>{props.user?.username}</h1>
      </div>
      <div className={classes.OtherUserProfileRight}>
        <div className={classes.Stats}>
          <div className={classes.Pongopoints}></div>
          <div className={classes.Ratio}></div>
          <div className={classes.Rank}></div>
          <div className={classes.Pongopoints}></div>
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
    </div>
  );
};

export default OtherUserProfile;
