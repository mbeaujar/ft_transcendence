import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './Discussion.module.scss';
import clsx from 'clsx';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';
import { IMessage } from '../../../../interface/message.interface';
import Avatar from '../../../Profile/components/Avatar.module';

import styles from './Discussion.module.scss';
import Input from './Input';

interface Props {
  user: IUser;
  channel: IChannel;
  ws: any;
  messages: any;
}

const Discussion: React.FC<Props> = (props: Props): JSX.Element => {
  var messageBody = document.querySelector('#msg');



  const renderedMessages = props.messages.map((message: any) => {
    return (
      <div key={message.id} className={classes.Message}>
        <h4>{message.user.username}:</h4>
        <p> {message.text}</p>
      </div>
    );
  });

  useEffect(() =>
  {
    if (messageBody)
    {
      messageBody.scrollTop = 10000000;
    }
  },[props.messages]);

  
  


  return (
    <div className={classes.Discussion}>
      <h1>{props.channel.name}</h1>
      <div className={classes.Messages} id='msg'>
        {renderedMessages}
      </div>
      <div className={classes.InputDiv}>
        <Input
          onSubmit={(text: string) => {
            const message: IMessage = {
              text,
              user: props.user,
            };
            props.ws.socket.emit('joinChannel', props.channel);
            if (props.channel !== null) {
              Object.assign(message, { channel: props.channel });
            }
            props.ws.socket.emit('addMessage', message);
            /*ftScrollbar();*/
          }}
        />
      </div>
    </div>
  );
};

export default Discussion;
