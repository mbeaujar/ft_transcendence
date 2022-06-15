import React, { useEffect, useState } from 'react';
import classes from './RightClick.module.scss';
import 'react-contexify/dist/ReactContexify.css';
import {
  Menu,
  Item
} from 'react-contexify';
import { Link } from 'react-router-dom';
import { IUser } from '../../../../interface/user.interface';
import api from '../../../../apis/api';
import { toast } from 'react-toastify';
import { IFriends } from '../../../../interface/friends.interface';
const MENU_ID = 'menu-id';

interface Props {
  messageUser: IUser | undefined;
}

function RightClick(props: Props) {
  const [userBlockedTab, setUserBlockedTab] = useState<IUser | null>(null);
  const [friendsList, setFriendsList] = useState<IFriends>();

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
  }, [props.messageUser]);

  function ftBlockUser() {
    let ret = 0;
    props.messageUser &&
      userBlockedTab &&
      userBlockedTab.blockedUsers.map((userBlock: IUser) => {
        if (
          props.messageUser &&
          userBlock.username === props.messageUser.username
        ) {
          ret = 1;
        }
      });
    if (ret === 1) {
      if (props.messageUser) {
        api
          .post('/users/unblock', { id: props.messageUser.id })
          .then(() => {
            props.messageUser
              ? toast.success(props.messageUser.username + ' was unblocked')
              : toast.success('');
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
      if (props.messageUser) {
        api
          .post('/users/block', { id: props.messageUser.id })
          .then(() => {
            friendsList &&
              friendsList.friends.map((friend) => {
                if (props.messageUser && friend.id === props.messageUser.id) {
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
            toast.success(
              props.messageUser
                ? props.messageUser.username + ' was blocked'
                : null,
            );
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

  function textBlocked() {
    let ret = 0;
    props.messageUser &&
      userBlockedTab &&
      userBlockedTab.blockedUsers.map((userBlock: IUser) => {
        if (
          props.messageUser &&
          userBlock.username === props.messageUser.username
        ) {
          ret = 1;
        }
      });
    if (ret === 1) return 'Unblock';
    else return 'Block';
  }

  function showInvite() {
    let ret = 0;
    props.messageUser &&
      friendsList &&
      friendsList.friends.map((friend: IUser) => {
        if (
          props.messageUser &&
          friend.username === props.messageUser.username
        ) {
          ret = 1;
        }
      });
    if (ret === 0) return classes.HideLink;
    else return classes.Link;
  }

  return (
    <div className={classes.RightClick}>
      <Menu id={MENU_ID} theme="dark">
        <Item className={classes.Item}>
          <Link
            className={classes.Link}
            to={'/profile/stats/' + props.messageUser?.username}
          >
            See profile
          </Link>
        </Item>
        <Item onClick={() => ftBlockUser()}>{textBlocked()}</Item>
        {textBlocked() === 'Block' ? (
          <Item className={showInvite()}>
            <Link
              className={showInvite()}
              to={'/game/play/room/pong'}
              state={{
                from: { opponent: props.messageUser?.username, mode: -1 },
              }}
            >
              Invite to play
            </Link>
          </Item>
        ) : (
          <Item>
            <p></p>
          </Item>
        )}
      </Menu>
    </div>
  );
}

export default RightClick;
