import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import classes from './Discussion.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';
import { IMessage } from '../../../../interface/message.interface';
import Avatar from '../../../Profile/components/Avatar/Avatar';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import styles from './Discussion.module.scss';
import { toast } from 'react-toastify';
import Input from './Input';
import styled from 'styled-components';

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import clsx from 'clsx';
import api from '../../../../apis/api';
import RightClick from '../RightClick/RightClick';
import { UserContext } from '../../../../context';

const MENU_ID = 'menu-id';

interface Props {
  channel: IChannel;
  socket: any;
  messages: IMessage[];
  showChatRight: boolean;
  setShowChatRight: (value: boolean) => void;
}

const Discussion: React.FC<Props> = (props: Props): JSX.Element => {
  var messageBody = document.querySelector('#msg');
  const [messageUser, setMessageUser] = useState<IUser>();
  const { user } = useContext(UserContext);

  // const [userBlockedTab, setUserBlockedTab] = useState<IUser | null>(null);

  useEffect(() => {
    messageBody = document.querySelector('#msg');
    if (messageBody) {
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }, [props.messages]);

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function displayMenu(
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>,
    userToVisit: IUser | null,
  ) {
    if (!userToVisit)
      return;
    setMessageUser(userToVisit);
    if (userToVisit.username !== user?.username) show(e);
  }

  const renderedMessages = props.messages.map(
    (message: IMessage) => {
      return (
        <div key={message.id} className={classes.Message}>
          <Avatar user={message.user} />
          <div className={classes.MessageRight}>
            <h4 onContextMenu={(e) => displayMenu(e, message.user)}>
              {message.user?.username}
            </h4>
            <p> {message.text}</p>
            <RightClick messageUser={messageUser} />
          </div>
        </div>
      );
    },
  );

  return (
    <div className={classes.Discussion}>
      <h1>
        {props.channel.state !== 3
          ? props.channel.name
          : props.channel.users[0]?.user?.id === user?.id
          ? `${props.channel.users[1]?.user?.username}`
          : `${props.channel.users[0]?.user?.username}`}
      </h1>
      <button
        className={clsx(
          classes.OpenChannelSettings,
          props.channel.name === 'DM' ? classes.HideOpenChannelSettings : null,
        )}
        onClick={() => props.setShowChatRight(!props.showChatRight)}
      >
        <span className="material-icons">settings</span>
      </button>
      <div className={classes.Messages} id="msg">
        {renderedMessages}
      </div>
      <div className={classes.InputDiv}>
        <Input
          onSubmit={(text: string) => {
            const message: IMessage = {
              text,
              user:user,
            };
            if (props.channel !== null) {
              Object.assign(message, { channel: props.channel });
            }
            props.socket.emit('addMessage', message);
          }}
        />
      </div>
    </div>
  );
};

export default Discussion;
