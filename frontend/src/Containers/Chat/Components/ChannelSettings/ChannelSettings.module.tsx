import React from 'react';
import { useState, useEffect, useRef } from 'react';
import classes from './ChannelSettings.module.scss';
import { IUser } from '../../../../interface/user.interface';
import { IChannel } from '../../../../interface/channel.interface';
import Avatar from '../../../Profile/components/Avatar/Avatar.module';
import Dropdown from './Dropdown/Dropdown.module';
import Dropdown2 from './Dropdown2/Dropdown2.module';
import { userInfo } from 'os';

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
    console.log(actualChannel);
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

  function ifShowAdminSettings() {
    let i = 0;
    while (actualChannel.users[i].user.username != props.user.username) {
      i++;
    }
    if (actualChannel.users[i].administrator == true)
      return classes.ShowAdminSettings;
    else return classes.HideAdminSettings;
  }

  function ifShowCreatorSettings() {
    let i = 0;
    while (actualChannel.users[i].user.username != props.user.username) {
      i++;
    }
    if (actualChannel.users[i].creator == true)
      return classes.ShowCreatorSettings;
    else return classes.HideCreatorSettings;
  }

  const itemsMuteDuration = [
    { id: 1, value: '1 hour' },
    { id: 2, value: '1 day' },
    { id: 3, value: '1 week' }
  ];

  const itemsChannelMode = [
    { id: 1, value: 'Public' },
    { id: 2, value: 'Private' },
    { id: 3, value: 'Protected' }
  ];

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

      <div className={ifShowAdminSettings()}>
        <h3>Admin settings</h3>
        <div className={classes.BanUser}>
          <p>Ban User</p>
          <input className={classes.BanUserInput}></input>
        </div>
        <div className={classes.MuteUser}>
          <p>Mute User</p>
          <input className={classes.MuteUserInput}></input>
        </div>
        <Dropdown title="Duration" items={itemsMuteDuration} />
        <div className={classes.UnmuteUser}>
          <p>Unmute User</p>
          <input className={classes.UnmuteUserInput}></input>
        </div>
      </div>

      <div className={ifShowCreatorSettings()}>
        <h3>Creator settings</h3>
        <div className={classes.NewAdmin}>
          <p>New Admin</p>
          <input className={classes.NewAdminInput}></input>
        </div>
        <Dropdown2 title="Channel Mode" items={itemsChannelMode} />
        <div className={classes.ChangePassword}>
          <p>Change password</p>
          <input className={classes.ChangePasswordInput}></input>
        </div>
        <div className={classes.ConfirmPassword}>
          <p>Confirm</p>
          <input className={classes.ConfirmInput}></input>
        </div>
        <div className={classes.ActualPassword}>
          <p>Actual password</p>
          <input className={classes.ActualPasswordInput}></input>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettings;
