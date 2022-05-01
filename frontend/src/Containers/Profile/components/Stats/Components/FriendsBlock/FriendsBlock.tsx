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
      .then((response) => {
        setFriendsList(response.data);
        console.log("friiiiends:", response.data);
      })
      .catch((reject) => console.error(reject));
  }, []);

  function stateClassName(state: number) {
    if (state === 0) return "Online";
    else if (state === 1) return "Offline";
    return "Ingame";
  }

  return (
    <div className="FriendsBlock">
      <h3 className="title">Friends</h3>
      <div className="Friends">
        {friendsList && (
          <div className="list">
            {friendsList.friends.map((friend: IUser) => (
              <div className="friendsListElement" key={friend.id}>
                <Avatar user={friend} />
                <p className="FriendName">{friend.username}</p>
                <p className={stateClassName(friend.state)}>
                  {friend.state === 0
                    ? "Online"
                    : friend.state === 1
                    ? "Offline"
                    : "Ingame"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsBlock;
