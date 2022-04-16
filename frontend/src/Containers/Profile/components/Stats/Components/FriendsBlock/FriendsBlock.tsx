import React, { useEffect, useState } from 'react';
import './FriendsBlock.scss';
import { IFriends } from '../../../../../../interface/friends.interface';
import { IUser } from '../../../../../../interface/user.interface';
import api from '../../../../../../apis/api';
import Avatar from '../../../Avatar/Avatar';

function FriendsBlock(props: any) {
  const [friendsList, setFriendsList] = useState<IFriends>();

  useEffect(() => {
    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));
  }, []);

  return (
    <div className="FriendsBlock">
    <h3 className="title">Friends</h3>
    <div className="Friends">
      {friendsList && (
        <div className="list">
          {friendsList.friends.map((friend: IUser) => (
            <div className="friendsListElement" key={friend.id}>
              <Avatar user={friend} />
              <p>{friend.username}</p>
            </div>
          ))}
          <div className="friendsListElement">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_ZFA7Nc5_IkQinevA7dBIwquje91csViyQ&usqp=CAU" />
            </div>
            <p>Eren</p>
          </div>
          <div className="friendsListElement">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU" />
            </div>
            <p>Livaï</p>
          </div>
          <div className="friendsListElement">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyhWqTEVwIMyW5Mx90y44YZjlkPVH-dm908g&usqp=CAU" />
            </div>
            <p>Erwin</p>
          </div>
          <div className="friendsListElement">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD1TQPCWvR6RTQ9SNgeRnw0tlF4QoUitDmg&usqp=CAU" />
            </div>
            <p>Rick</p>
          </div>
          <div className="friendsListElement">
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQww5NXS3n-jtIJeol6l462l_Nl-X9BUH6vLw&usqp=CAU" />
            </div>
            <p>Jon</p>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default FriendsBlock;
