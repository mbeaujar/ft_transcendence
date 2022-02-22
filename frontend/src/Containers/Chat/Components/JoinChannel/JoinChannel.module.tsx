import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './JoinChannel.module.scss';
import clsx from 'clsx';
import styles from './JoinChannel.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';

interface Props {
  user: IUser;
  socketEmit: any;
  channelNotJoin: IChannel[];
}

const JoinChannel: React.FC<Props> = (props: Props): JSX.Element => {


  return(
    <div className={classes.JoinChannel}>
      <h1>Join Channel</h1>
      {props.channelNotJoin.map((channel: IChannel) => (
              <div className={classes.friendsListElement} key={channel.id}>
                <p>{channel.name}</p>
              </div>
            ))}
    </div>
  );
}

export default JoinChannel;
