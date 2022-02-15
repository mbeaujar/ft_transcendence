import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
// import clsx from 'clsx';

import classes from './Friends.module.scss';
import { IFriends } from '../interface/friends.interface';
import Input from './Input.module';
import { IUser } from '../interface/user.interface';

const avatar = 'https://cdn.intra.42.fr/users/mbeaujar.jpg';

function Friends() {
  const [friendsList, setFriendsList] = useState<IFriends>();
  // const [friendsRequest, setFriendsRequest] = useState<>();
  const [refresh, setRefresh] = useState<any>(0);

  useEffect(() => {
    api
      .get('/friends/list')
      .then(response => setFriendsList(response.data))
      .catch(reject => console.log(reject));
  }, [refresh]);

  return (
    <div className={classes.Friends}>
      <div className={classes.FriendsLeft}>
        <h2>My Friends</h2>
        {friendsList && (
          <div className={classes.list}>
            {friendsList.friends.map((friend: IUser) => (
              <div className={classes.friendsListElement} key={friend.id}>
                <img src={avatar} />
                <p>{friend.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={classes.FriendsRight}>
        <div className={classes.AddFriends}>
          <h2>Add new friends</h2>
          <Input
            label="Search user : "
            onSubmit={(text: string) => {
              api
                .post('/friends/add', { id: parseInt(text) })
                .then(response => setRefresh(0))
                .catch(reject => console.log(reject));
            }}
          />
        </div>

        {/* <div className={classes.FriendsRequest}>
          <h2>Friends Request</h2>
          {stateFriendsRequests && (
            <div className={classes.request}>
              {stateFriendsRequests.map((friendsRequests: any) => (
                <div
                  className={classes.friendsRequestsElement}
                  key={friendsRequests.user}
                >
                  <img src={getFriendsRequests(friendsRequests, 'avatar')} />
                  <p>{getFriendsRequests(friendsRequests, 'username')}</p>
                  <button
                    className={classes.accept}
                    onClick={() => acceptRequest(friendsRequests)}
                  >
                    Accept
                  </button>
                  <button
                    className={classes.refuse}
                    onClick={() => refuseRequest(friendsRequests)}
                  >
                    Refuse
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Friends;
