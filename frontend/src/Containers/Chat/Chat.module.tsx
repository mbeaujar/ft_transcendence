import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import classes from './Chat.module.scss';
import { WebSocket } from './Socket.module';
import { IUser } from '../../interface/user.interface';
import { IChannel } from '../../interface/channel.interface';
import SearchUser from './Components/SearchUser/SearchUser.module';
import JoinChannel from './Components/JoinChannel/JoinChannel.module';
import CreateChannel from './Components/CreateChannel/CreateChannel.module';
import Discussion from './Components/Discussion/Discussion.module';
import { IMessage } from '../../interface/message.interface';
import { Scope } from '../../interface/scope.enum';
import { IJoinChannel } from '../../interface/join-channel.interface';

const ws = new WebSocket('http://localhost:3000');

interface Props {
  user: IUser;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelsJoin, setChannelsJoin] = useState<IChannel[]>([]);
  const [channelsNotJoin, setChannelsNotJoin] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [activeChatMenu, setActiveChatMenu] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
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
    if (activeChatMenu == null || channelChoose)
      if (channelChoose)
      {
        /*console.log(messages);*/
        return (<Discussion user={props.user} channel={channelChoose} ws={ws} messages={messages}/>);
      }
      else return <p>Choose a menu</p>;
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
      <p
        key={channel.id}
        onClick={() => {
          const joinChannel: IJoinChannel = {
            channel,
          };
          if (channel.state === Scope.protected) {
            Object.assign(joinChannel, { password: prompt('password') });
          }
          ws.socket.emit('joinChannel', joinChannel);
        }}
      >
        {channel.name}
      </p>
    ));
  };

  return (
    <>
      <div className={clsx(classes.Chat)}>
        <div className={classes.ChatLeft}>
          <button
            className={clsx(classes.ChatLeftButton, classes.SearchUserButton)}
            onClick={() => {
              setActiveChatMenu('SearchUser');
              setChannelChoose(null);
            }}
          >
            Search user
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.JoinChannelButton)}
            onClick={() => {
              setActiveChatMenu('JoinChannel');
              setChannelChoose(null);
            }}
          >
            Join channel
          </button>
          <button
            className={clsx(
              classes.ChatLeftButton,
              classes.CreateChannelButton
            )}
            onClick={() => {
              setActiveChatMenu('CreateChannel');
              setChannelChoose(null);
            }}
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
