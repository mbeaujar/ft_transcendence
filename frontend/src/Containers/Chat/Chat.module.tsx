import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import clsx from 'clsx';
import classes from './Chat.module.scss';
import { WebSocket } from './Socket.module';
import { IUser } from '../../interface/user.interface';
import { Scope } from '../../interface/scope.enum';
import { IChannel } from '../../interface/channel.interface';
import { IMessage } from '../../interface/message.interface';
import { IJoinChannel } from '../../interface/join-channel.interface';
import SearchUser from './Components/SearchUser/SearchUser.module';
import JoinChannel from './Components/JoinChannel/JoinChannel.module';
import CreateChannel from './Components/CreateChannel/CreateChannel.module';
import { channel } from 'diagnostics_channel';

const ws = new WebSocket('http://localhost:3000');

interface Props {
  user: IUser;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelsJoin, setChannelsJoin] = useState<IChannel[]>([]);
  const [channelsNotJoin, setChannelsNotJoin] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeChatMenu, setActiveChatMenu] = useState<any>(null);
  let channelsJoin2 = channelsJoin;
  let channelsNotJoin2 = channelsNotJoin;

  useEffect(() => {
    ws.socket.on('channels', (data) => {
      setChannels(data);
    });

    ws.socket.on('messages', (data) => {
      console.log('messages', data);
      setMessages(data);
    });

    ws.socket.on('messageAdded', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    ws.socket.on('currentChannel', (data) => {
      setChannelChoose(data);
    });

    ws.socket.emit('getAllChannels');
  }, []);

  useEffect(() => {
    console.log('list of channels', channels);
    setChannelsJoin(channelsJoin2);
    setChannelsNotJoin(channelsNotJoin2);
  }, [channels, activeChatMenu]);

  function ftChannelJoin() {
    channelsJoin2 = [];
    channelsNotJoin2 = [];
    let i = 0;
    channels.map((channel: IChannel) => {
      i = 0;
      channel.users.map((userList: any) => {
        if (userList.user.username === props.user.username) {
          channelsJoin2.push(channel);
          i = 1;
        }
      });
      if (i == 0) {
        channelsNotJoin2.push(channel);
      }
    });
  }


  const ftActiveChatMenu = () => {
    if (activeChatMenu == null) return <p></p>;
    else if (activeChatMenu === 'SearchUser') return <SearchUser />;
    else if (activeChatMenu === 'JoinChannel') {
      return (
        <JoinChannel
          user={props.user}
          channelNotJoin={channelsNotJoin2}
          ws={ws}
        />
      );
    } else if (activeChatMenu === 'CreateChannel')
      return (
        <CreateChannel
          user={props.user}
          socketEmit={(channel: IChannel) => {
            ws.socket.emit('createChannel', channel);
          }}
        />
      );
  };

  const ftDisplayJoinChannel = () => {
    ftChannelJoin();
    return channelsJoin2.map((channel: IChannel) => (
      <p key={channel.id}>{channel.name}</p>
    ));
  };

  return (
    <>
      <div className={clsx(classes.Chat)}>
        <div className={classes.ChatLeft}>
          <button
            className={clsx(classes.ChatLeftButton, classes.SearchUserButton)}
            onClick={() => setActiveChatMenu('SearchUser')}
          >
            Search user
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.JoinChannelButton)}
            onClick={() => setActiveChatMenu('JoinChannel')}
          >
            Join channel
          </button>
          <button
            className={clsx(
              classes.ChatLeftButton,
              classes.CreateChannelButton
            )}
            onClick={() => setActiveChatMenu('CreateChannel')}
          >
            Create channel
          </button>

          <h3 className={clsx(classes.Channels)}>Channels</h3>
          {ftDisplayJoinChannel()}
          <h3 className={clsx(classes.Messages)}>Messages</h3>
          <p>Sommecaise</p>
          <p>Ramzi</p>
        </div>

        <div className={classes.ChatCenter}>{ftActiveChatMenu()}</div>

        <div className={classes.ChatRight}></div>
      </div>
    </>
  );
};

export default Chat;
