import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import Avatar from './Avatar.module';

import classes from './Friends.module.scss';
import { IFriends } from '../interface/friends.interface';
import Input from './Input.module';
import { IUser } from '../interface/user.interface';
import { IFriendsRequest } from '../interface/friends-request.interface';

const Friends: React.FC = (): JSX.Element => {
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [friendsRequest, setFriendsRequest] = useState<IFriendsRequest[]>([]);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    console.log('refresh');
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
    api
      .get('/friends/request')
      .then((response) => setFriendsRequest(response.data))
      .catch((reject) => console.error(reject));
  }, [refresh]);

  const acceptRequest = (username: string) => {
    api
      .post('/friends/add', { username })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };

  const refuseRequest = (id: number) => {
    api
      .post('/friends/refuse', { id })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };

  const deleteFriend = (friendsList: any) => {
    api
      .delete(`/friends/${friendsList.id}`)
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };

  return (
    <div className={classes.Friends}>
      <div className={classes.FriendsLeft}>
        <h2>My Friends</h2>
        {friendsList && (
          <div className={classes.list}>
            {friendsList.friends.map((friend: IUser) => (
              <div className={classes.friendsListElement} key={friend.id}>
                <Avatar user={friend} />
                <p>{friend.username}</p>
                <button
                  className={classes.delete}
                  onClick={() => deleteFriend(friend)}
                >
                  Delete
                </button>
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
              if (text === undefined || text === null) {
                return;
              }
              api
                .post('/friends/add', { username: text })
                .then((response) => setRefresh(refresh + 1))
                .catch((reject) => console.log(reject));
            }}
          />
        </div>

        <div className={classes.FriendsRequest}>
          <h2>Friends Request</h2>
          {friendsRequest && (
            <div className={classes.request}>
              {friendsRequest.map((friendRequest: IFriendsRequest) => (
                <div
                  className={classes.friendsRequestsElement}
                  key={friendRequest.user}
                >
                  <Avatar user={friendRequest.userInfo} />
                  <p>{friendRequest.userInfo?.username}</p>
                  <button
                    className={classes.accept}
                    onClick={() =>
                      acceptRequest(friendRequest.userInfo.username)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className={classes.refuse}
                    onClick={() => refuseRequest(friendRequest.user)}
                  >
                    Refuse
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
