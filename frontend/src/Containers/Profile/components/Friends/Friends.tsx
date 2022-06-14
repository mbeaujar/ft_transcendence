import React, { useEffect, useState } from 'react';
import './Friends.scss';
import MyFriends from './Components/MyFriends/MyFriends';
import AddFriends from './Components/AddFriends/AddFriends';
import FriendsRequest from './Components/FriendsRequest/FriendsRequest';

function Friends() {
  const [refreshMyFriends, setRefreshMyFriends] = useState<number>(0);

  useEffect(() => {}, []);

  return (
    <div className="Friends">
      <MyFriends refreshMyFriends={refreshMyFriends} />
      <div className="FriendsRight">
        <AddFriends />
        <FriendsRequest
          refreshMyFriends={refreshMyFriends}
          setRefreshMyFriends={setRefreshMyFriends}
        />
      </div>
    </div>
  );
}

export default Friends;
