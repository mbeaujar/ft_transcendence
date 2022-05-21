import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './SearchUser.module.scss';
import clsx from 'clsx';
import styles from './SearchUser.module.scss';
import { IUser } from '../../../../interface/user.interface';
import api from '../../../../apis/api';
import Avatar from '../../../Profile/components/Avatar/Avatar';
import { toast } from 'react-toastify';
import { IChannel } from '../../../../interface/channel.interface';
import { Scope } from '../../../../interface/scope.enum';
import { BrowserRouter as Router, Link } from 'react-router-dom';

interface Props {
  user: IUser;
  socketEmit: any;
}

function SearchUser(props: Props) {
  const [searchUserInput, setSearchUserInput] = useState<string>('');
  const [userToFind, setUserToFind] = useState<IUser | null>(null);
  const [userBlockedTab, setUserBlockedTab] = useState<IUser | null>(null);

  function handleChangesearchUserInput(
    event: React.FormEvent<HTMLInputElement>,
  ) {
    var value = event.currentTarget.value;
    setSearchUserInput(value);
  }

  function handleSubmitFormSearchUser(event: React.FormEvent<HTMLFormElement>) {
    console.log('userr=', searchUserInput);
    if (searchUserInput === props.user.username) {
      toast.error("You can't search yourself");
      event.preventDefault();
      return;
    }
    api
      .get(`/users/username/${searchUserInput}`)
      .then((response) => {
        setSearchUserInput('');
        setUserToFind(response.data);
      })
      .catch(() => {
        setUserToFind(null);
        toast.error('User not find');
      });

    event.preventDefault();
  }

  function ftCreateDiscussion() {
    let channel: IChannel;

    channel = {
      name: 'DM',
      state: 3,
      users: [],
    };

    if (channel.state === Scope.discussion) {
      props.socketEmit('createDiscussion', {
        channel,
        user: userToFind,
      });
    }
  }

  function ftBlockUser() {
    if (userToFind) {
      api
        .post('/users/block', { id: userToFind.id })
        .then((response: any) => {
          api
            .get('/users/getBlockedUser')
            .then((response) => {
              setUserBlockedTab(response.data);
            })
            .catch((reject) => console.error(reject));
          userBlockedTab &&
            userBlockedTab.blockedUsers.map((userBlock: IUser) => {
              if (userBlock.username === userToFind.username) {
                toast.error(userToFind.username + ' was already blocked');
                return;
              }
            });
          toast.success(userToFind.username + ' was blocked');
        })
        .catch((reject) => console.error(reject));
    }
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
            <button onClick={() => ftCreateDiscussion()}>
              Start Conversation
            </button>
            <Link
              className={classes.Link}
              to={'/profile/' + userToFind.username}
            >
              See profile
            </Link>
            <Link
              className={classes.Link}
              to={'/game/play/room/pong'}
              state={{
                from: { opponent: userToFind.username, mode: -1 },
              }}
            >
              Invite to play
            </Link>
            <button className={classes.Button} onClick={() => ftBlockUser()}>
              Block
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchUser;
