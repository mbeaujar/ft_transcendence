import React, { useContext } from 'react';
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
import { IFriends } from '../../../../interface/friends.interface';
import { UserContext } from '../../../../context';

interface Props {
  user: IUser | null;
  socketEmit: any;
}

function SearchUser(props: Props) {
  const [searchUserInput, setSearchUserInput] = useState<string>('');
  const [userToFind, setUserToFind] = useState<IUser | null>(null);
  const [userBlockedTab, setUserBlockedTab] = useState<IUser | null>(null);
  const [friendsList, setFriendsList] = useState<IFriends>();
  const [refresh, setRefresh] = useState<number>(0);
  const { user } = useContext(UserContext);


  useEffect(() => {
    api
      .get('/users/getBlockedUser')
      .then((response) => {
        setUserBlockedTab(response.data);
      })
      .catch((reject) => console.error(reject));

    api
      .get('/friends/list')
      .then((response) => setFriendsList(response.data))
      .catch((reject) => console.error(reject));

    console.log('usestate');
  }, [userToFind, refresh]);

  useEffect(() => {}, []);

  function handleChangesearchUserInput(
    event: React.FormEvent<HTMLInputElement>,
  ) {
    var value = event.currentTarget.value;
    setSearchUserInput(value);
  }

  function handleSubmitFormSearchUser(event: React.FormEvent<HTMLFormElement>) {
    console.log('userr=', searchUserInput);
    if (searchUserInput === user?.username) {
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

  function textBlocked() {
    let ret = 0;
    userToFind &&
      userBlockedTab &&
      userBlockedTab.blockedUsers.map((userBlock: IUser) => {
        if (userBlock.username === userToFind.username) {
          ret = 1;
        }
      });
    if (ret === 1) return 'Unblock';
    else return 'Block';
  }

  function showInvite() {
    let ret = 0;
    userToFind &&
      friendsList &&
      friendsList.friends.map((friend: IUser) => {
        if (friend.username === userToFind.username) {
          ret = 1;
        }
      });
    if (ret === 0) return classes.HideLink;
    else return classes.Link;
  }

  function ftBlockUser() {
    let ret = 0;
    userToFind &&
      userBlockedTab &&
      userBlockedTab.blockedUsers.map((userBlock: IUser) => {
        if (userBlock.username === userToFind.username) {
          ret = 1;
        }
      });
    if (ret === 1) {
      if (userToFind) {
        api
          .post('/users/unblock', { id: userToFind.id })
          .then(() => {
            toast.success(userToFind.username + ' was unblocked');
            api
              .get('/users/getBlockedUser')
              .then((response) => {
                setUserBlockedTab(response.data);
              })
              .catch((reject) => console.error(reject));
          })
          .catch((reject) => console.error(reject));
      }
    } else {
      if (userToFind) {
        api
          .post('/users/block', { id: userToFind.id })
          .then(() => {
            setRefresh(refresh + 1);
            friendsList &&
              friendsList.friends.map((friend) => {
                if (userToFind && friend.id === userToFind.id) {
                  api
                    .delete(`/friends/${friend.id}`)
                    .then(() =>
                      api
                        .get('/friends/list')
                        .then((response) => setFriendsList(response.data))
                        .catch((reject) => console.error(reject)),
                    )
                    .catch((reject) => console.error(reject));
                }
              });
            toast.success(userToFind.username + ' was blocked');
            api
              .get('/users/getBlockedUser')
              .then((response) => {
                setUserBlockedTab(response.data);
              })
              .catch((reject) => console.error(reject));
          })
          .catch((reject) => console.error(reject));
      }
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
              to={'/profile/stats/' + userToFind.username}
            >
              See profile
            </Link>
            <Link
              className={showInvite()}
              to={'/game/play/room/pong'}
              state={{
                from: { opponent: userToFind.username, mode: -1 },
              }}
            >
              Invite to play
            </Link>
            <button className={classes.Button} onClick={() => ftBlockUser()}>
              {textBlocked()}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchUser;
