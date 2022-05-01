import React, { useEffect, useState } from "react";
import "./FriendsBlock.scss";
import { IFriends } from "../../../../../../interface/friends.interface";
import { IUser } from "../../../../../../interface/user.interface";
import api from "../../../../../../apis/api";
import Avatar from "../../../Avatar/Avatar";

function FriendsBlock(props: any) {
  const [friendsList, setFriendsList] = useState<IFriends>();

  useEffect(() => {
    api
      .get("/friends/list")
      .then((response) => {setFriendsList(response.data);console.log(response.data)})
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
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsBlock;
