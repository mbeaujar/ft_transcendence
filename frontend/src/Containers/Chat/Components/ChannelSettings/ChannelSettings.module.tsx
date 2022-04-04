import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './ChannelSettings.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';
import Avatar from '../../../Profile/components/Avatar/Avatar.module';

interface Props {
  user: IUser;
  channel: IChannel;
  channels: IChannel[];
  ws: any;
}

const ChannelSettings: React.FC<Props> = (props: Props): JSX.Element => {
  let actualChannel: any = ftGetActualChannel();
  useEffect(() => {
    actualChannel = ftGetActualChannel();
  }, [props.channel]);

  function ftGetActualChannel() {
    let i = 0;
    while (i < props.channels.length) {
      if (props.channels[i].name == props.channel.name) {
        return props.channels[i];
      }
      i++;
    }
  }

  return (
    <div className={classes.ChannelSettings}>
      <div className={classes.ChannelUsers}>
        <h3>Users</h3>
        {actualChannel.users.map((user: any) => (
          <div className={classes.ChannelUser} key={user.id}>
            <Avatar user={user.user} />
            <p>{user.user.username}</p>
          </div>
        ))}
      </div>

      <div className={classes.UserSettings}>
        <h3>User settings</h3>
        <button
          onClick={() => {
            props.ws.socket.emit('leaveChannel', props.channel);
          }}
        >
          Leave channel
        </button>
      </div>

      <div className={classes.AdminSettings}>
        <h3>Admin settings</h3>
        <div className={classes.BanUser}>
          <p>Ban User</p>
          <input className={classes.BanUserInput}></input>
        </div>
        <div className={classes.MuteUser}>
          <p>Mute User</p>
          <input className={classes.MuteUserInput}></input>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettings;
