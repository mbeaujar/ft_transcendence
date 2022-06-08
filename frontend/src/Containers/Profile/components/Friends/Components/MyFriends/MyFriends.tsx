import React, { useState, useEffect } from 'react';
import Avatar from '../../../Avatar/Avatar';
import api from '../../../../../../apis/api';
import { IFriends } from '../../../../../../interface/friends.interface';
import { IUser } from '../../../../../../interface/user.interface';
import './MyFriends.scss';

interface Props {
  refreshMyFriends: number;
}

function MyFriends(props: Props) {
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {

    const controller = new AbortController();

    api
      .get('/friends/list', {
        signal: controller.signal,
      })
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));

      return () => {
        controller.abort();
      };

  }, [refresh, props.refreshMyFriends]);

  const deleteFriend = (friendsList: IUser) => {
    api
      .delete(`/friends/${friendsList.id}`)
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };
  return (
    <div className="MyFriends">
      <h2>My Friends</h2>
      {friendsList && (
        <div className="list">
          {friendsList.friends.map((friend: IUser) => (
            <div className="friendsListElement" key={friend.id}>
              <Avatar user={friend} />
              <p>{friend.username}</p>
              <button className="delete" onClick={() => deleteFriend(friend)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFriends;
