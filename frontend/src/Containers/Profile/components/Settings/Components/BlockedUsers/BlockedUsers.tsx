import React, { useEffect, useState } from "react";
import api from "../../../../../../apis/api";
import { IUser } from "../../../../../../interface/user.interface";
import Avatar from "../../../Avatar/Avatar";
import { toast } from "react-toastify";
import "./BlockedUsers.scss";

interface Props {
  user: IUser;
}
function BlockedUsers(props: Props) {
  useEffect(() => {}, []);

  function ftUnblockUser(userBlocked: IUser) {
    api
      .post("/users/unblock", { id: userBlocked.id })
      .then((response) => toast.success(userBlocked.username + " was ublocked"))
      .catch((reject) =>
        toast.error(userBlocked.username + " wasn't ublocked")
      );
  }

  return (
    <div className="BlockedUsers">
      <h3>Blocked users</h3>
      <div className="BlockedUsers">
        {props.user.blockedUsers.map((userBlocked: IUser) => (
          <div className="BlockedUser" key={userBlocked.id}>
            <Avatar user={userBlocked} />
            <p>{userBlocked.username}</p>
            <button onClick={() => ftUnblockUser(userBlocked)}>Unblock</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockedUsers;
