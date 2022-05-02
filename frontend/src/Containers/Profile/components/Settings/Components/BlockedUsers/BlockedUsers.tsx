import React, { useEffect, useState } from "react";
import { IUser } from "../../../../../../interface/user.interface";
import Avatar from "../../../Avatar/Avatar";
import "./BlockedUsers.scss";

function BlockedUsers(props: any) {
  useEffect(() => {}, []);

  function ftUnblockUser() {}
  return (
    <div className="BlockedUsers">
      <h3>Blocked users</h3>
      <div className="BlockedUsers">
        {props.user.blockedUsers.map((userBlocked: any) => (
          <div className="BlockedUser" key={userBlocked.id}>
            <Avatar user={userBlocked} />
            <p>{userBlocked.username}</p>
            <button onClick={() => ftUnblockUser()}>Unblock</button>
          </div>
        ))}
        <div className="BlockedUser">
          <Avatar user={props.user} />
          <p>{props.user.username}</p>
          <button onClick={() => ftUnblockUser()}>Unblock</button>
        </div>
        <div className="BlockedUser">
          <Avatar user={props.user} />
          <p>{props.user.username}</p>
          <button onClick={() => ftUnblockUser()}>Unblock</button>
        </div>
        <div className="BlockedUser">
          <Avatar user={props.user} />
          <p>{props.user.username}</p>
          <button onClick={() => ftUnblockUser()}>Unblock</button>
        </div>
        <div className="BlockedUser">
          <Avatar user={props.user} />
          <p>{props.user.username}</p>
          <button onClick={() => ftUnblockUser()}>Unblock</button>
        </div>
      </div>
    </div>
  );
}

export default BlockedUsers;
