import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './JoinChannel.module.scss';
import clsx from 'clsx';
import styles from './JoinChannel.module.scss';
import { Scope } from '../../../../interface/scope.enum';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';
import { IJoinChannel } from '../../../../interface/join-channel.interface';

interface Props {
  user: IUser;
  channels: IChannel[];
  channelNotJoin: IChannel[];
  ws: any;
  action: any;
}

const JoinChannel: React.FC<Props> = (props: Props): JSX.Element => {
  useEffect(() => {
  }, []);

  return (
    <div className={classes.JoinChannel}>
      <h1>Join Channel</h1>
      {props.channelNotJoin.map((channel: IChannel) => (
        <div className={classes.ChannelToJoin} key={channel.id}>
          <p>{channel.name}</p>
          <button
            onClick={() => {
              const joinChannel: IJoinChannel = {
                channel,
              };
              if (channel.state === Scope.protected) {
                Object.assign(joinChannel, { password: prompt('password') });
              }
              props.ws.socket.emit('joinChannel', joinChannel);
              props.ws.socket.emit('getAllChannels');
            }}
          >
            Join channel
          </button>
        </div>
      ))}
    </div>
  );
};

export default JoinChannel;
