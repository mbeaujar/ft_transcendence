import React, { useEffect, useState } from "react";
import api from "../../../../apis/api";
import Avatar from "../Avatar/Avatar";
import classes from "./Friends.module.scss";
import Input from "../Input/Input";
import { IFriends } from "../../../../interface/friends.interface";
import { IUser } from "../../../../interface/user.interface";
import { IFriendsRequest } from "../../../../interface/friends-request.interface";
import MyFriends from "./Components/MyFriends/MyFriends";
import AddFriends from "./Components/AddFriends/AddFriends";
import FriendsRequest from "./Components/FriendsRequest/FriendsRequest";

function Friends() {
  const [refreshMyFriends, setRefreshMyFriends] = useState<number>(0);

  useEffect(() => {
    console.log("friends effect");
  }, []);

  return (
    <div className={classes.Friends}>
      <MyFriends refreshMyFriends={refreshMyFriends}/>
      <div className={classes.FriendsRight}>
        <AddFriends />
        <FriendsRequest refreshMyFriends={refreshMyFriends} setRefreshMyFriends={setRefreshMyFriends}/>
      </div>
    </div>
  );
}

export default Friends;
