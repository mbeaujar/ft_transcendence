import React, { useState } from 'react';
import classes from './RightClick.module.scss';
import 'react-contexify/dist/ReactContexify.css';
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify';
import { Link } from 'react-router-dom';
import { IUser } from '../../../../interface/user.interface';
import api from '../../../../apis/api';
import { toast } from 'react-toastify';
const MENU_ID = 'menu-id';

interface Props {
  messageUser: IUser|undefined;
  socket: any;
}

function RightClick(props: Props) {
  const [userBlockedTab, setUserBlockedTab] = useState<IUser | null>(null);
  function RightClickBlock() {
    console.log('RightClickBlock', props.messageUser);
    let userToBlock: IUser;
    api
      .get(`/users/username/${props.messageUser?.username}`)
      .then((response) => {
        userToBlock = response.data;
        api
          .post('/users/block', { id: userToBlock.id })
          .then((response: any) => {
            api
              .get('/users/getBlockedUser')
              .then((response) => {
                setUserBlockedTab(response.data);
              })
              .catch((reject) => console.error(reject));
            userBlockedTab &&
              userBlockedTab.blockedUsers.map((userBlock: IUser) => {
                if (userBlock.username === userToBlock.username) {
                  toast.error(props.messageUser?.username + ' was already blocked');
                  return;
                }
              });
            toast.success(userToBlock.username + ' was blocked');
          })
          .catch((reject) => console.error(reject));
      })
      .catch(() => {
        toast.error('User not find');
      });
  }

  function RightClickInviteToPlay() {
    console.log('RightClickInviteToPlay', props.messageUser);
  }

 

  return (
    <>
      <Menu id={MENU_ID} theme="dark">
        <Item>
          <Link
            className={classes.Link}
            to={'/profile/' + props.messageUser?.username}
          >
            See profile
          </Link>
        </Item>
        <Item onClick={() => RightClickBlock()}>Block this user</Item>
        <Item
          onClick={() => {
            RightClickInviteToPlay();
            props.socket.emit('pingToPlay', props.messageUser);
          }}
        >
          <Link
            className={classes.Link}
            to={'/game/play/room/pong'}
            state={{
              from: { opponent: props.messageUser?.username, mode: -1 },
            }}
          >
            Invite to play
          </Link>
        </Item>
      </Menu>
    </>
  );
}

export default RightClick;
