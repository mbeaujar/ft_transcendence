import React from "react";
import { useState, useEffect, useRef } from "react";
import classes from "./SearchUser.module.scss";
import clsx from "clsx";
import styles from "./SearchUser.module.scss";
import { IUser } from "../../../../interface/user.interface";
import api from "../../../../apis/api";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import { toast } from "react-toastify";

function SearchUser() {
  const [searchUserInput, setSearchUserInput] = useState<string>("");
  const [userToFind, setUserToFind] = useState<IUser | null>(null);

  function handleChangesearchUserInput(event: any) {
    var value = event.target.value;
    setSearchUserInput(value);
  }



  function handleSubmitFormSearchUser(event: any) {
    console.log("userr=", searchUserInput);
    api
      .get(`/users/username/${searchUserInput}`)
      .then((response) => {
        setUserToFind(response.data);
      })
      .catch(() => {setUserToFind(null);toast.error("User not find")});

    setSearchUserInput("");
    event.preventDefault();
  }

  return (
    <div className={classes.SearchUser}>
      <h1>Search User</h1>
      <form
        className={classes.SearchUserForm}
        onSubmit={(event) => handleSubmitFormSearchUser(event)}
      >
        <p>Name of User</p>
        <input
          className={classes.NewPasswordInput}
          type="text"
          value={searchUserInput}
          onChange={(event) => handleChangesearchUserInput(event)}
        ></input>
      </form>
      {userToFind ? (
        <div className={classes.UserFind}>
          <div className={classes.UserFindLeft}>
            <Avatar user={userToFind} />
            <p>{userToFind.username}</p>
          </div>
          <div className={classes.UserFindRight}>
            <button>Start Conversation</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchUser;
