import React, { useEffect, useState, Fragment, useContext } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import classes from './Chat.module.scss';
import { IUser } from '../../interface/user.interface';
import { IChannel } from '../../interface/channel.interface';
import SearchUser from './Components/SearchUser/SearchUser';
import JoinChannel from './Components/JoinChannel/JoinChannel';
import CreateChannel from './Components/CreateChannel/CreateChannel';
import Discussion from './Components/Discussion/Discussion';
import { IMessage } from '../../interface/message.interface';
import { IJoinChannel } from '../../interface/join-channel.interface';
import ChannelSettings from './Components/ChannelSettings/ChannelSettings';
import { Scope } from '../../interface/scope.enum';
import getSocket from '../Socket';
import RightClick from './Components/RightClick/RightClick';
import { useContextMenu } from 'react-contexify';
import { UserContext } from '../../context';
const MENU_ID = 'menu-id';

const Chat: React.FC = (): JSX.Element => {
  const { user } = useContext(UserContext);

  const [channels, setChannels] = useState<IChannel[]>([]);
  const [discussion, setDiscussion] = useState<IChannel[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [socket, setSocket] = useState<any>(null);

  const [channelsJoin, setChannelsJoin] = useState<IChannel[]>([]);
  const [channelsNotJoin, setChannelsNotJoin] = useState<IChannel[]>([]);

  const [activeChatMenu, setActiveChatMenu] = useState<String | null>(null);

  const [showChatLeft, setShowChatLeft] = useState(true);
  const [showChatRight, setShowChatRight] = useState(false);

  useEffect(() => {
    const socketEffect = getSocket('chat');

    socketEffect.on('channels', (data: any) => {
      setChannels(data);
    });

    socketEffect.on('discussion', (data: any) => {
      setDiscussion(data);
    });

    socketEffect.on('newDiscussion', (data: any) => {
      setDiscussion([...discussion, data]);
    });

    socketEffect.on('messages', (data: any) => {
      setMessages(data);
    });

    socketEffect.on('messageAdded', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    socketEffect.on('Error', (data: any) => {
      toast.error(data.message);
    });

    socketEffect.on('Success', (data: any) => {
      toast.success(data.message);
    });
    socketEffect.on('inviteToPlay', (data: any) => {
      toast.success(data.message);
    });
    socketEffect.on('currentChannel', (data: any) => {
      setChannelChoose(data);
    });
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    ftChannelJoin();
  }, [channels]);

  function ftChannelJoin() {
    let i = 0;
    setChannelsJoin([]);
    setChannelsNotJoin([]);
    channels.map((channel: IChannel) => {
      i = 0;
      channel.users.map((userList: IUser) => {
        if (userList.user.username === user?.username) {
          setChannelsJoin((prev) => [...prev, channel]);
          i = 1;
        }
      });
      if (i === 0) {
        setChannelsNotJoin((prev) => [...prev, channel]);
      }
    });
  }

  const ftDisplayJoinChannel = () => {
    return channelsJoin.map((channel: IChannel) => (
      <p
        className={classes.ChannelName}
        key={channel.id}
        onClick={() => {
          const joinChannel: IJoinChannel = {
            channel,
          };
          socket.emit('joinChannel', joinChannel);
          setShowChatLeft(!showChatLeft);
        }}
      >
        {channel.name}
      </p>
    ));
  };

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function displayMenu(
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>,
    userToVisit: IUser,
  ) {
    if (userToVisit.username !== user?.username) show(e);
  }

  const ftDisplayDM = () => {
    return discussion.map((channel: IChannel) => (
      <p
        className={classes.ChannelName}
        key={channel.id}
        onClick={() => {
          const joinChannel: IJoinChannel = {
            channel,
          };
          socket.emit('joinChannel', joinChannel);
          setShowChatLeft(!showChatLeft);
        }}
      >
        {channel.users[0]?.user?.id === user?.id
          ? `${channel.users[1]?.user?.username}`
          : `${channel.users[0]?.user?.username}`}
      </p>
    ));
  };

  const ftActiveChatMenuCenter = () => {
    if (activeChatMenu === null || channelChoose)
      if (channelChoose) {
        return (
          <Discussion
            socket={socket}
            channel={channelChoose}
            messages={messages}
            showChatRight={showChatRight}
            setShowChatRight={setShowChatRight}
          />
        );
      } else return <p></p>;
    else if (activeChatMenu === 'SearchUser')
      return (
        <SearchUser
          socketEmit={(message: string, channel: IChannel) => {
            socket.emit(message, channel);
          }}
          user={user}
        />
      );
    else if (activeChatMenu === 'JoinChannel') {
      return (
        <JoinChannel
          user={user}
          socket={socket}
          channels={channels}
          channelNotJoin={channelsNotJoin}
        />
      );
    } else if (activeChatMenu === 'CreateChannel')
      return (
        <CreateChannel
          user={user}
          socketEmit={(channel: IChannel) => {
            socket.emit('createChannel', channel);
          }}
        />
      );
  };

  const ftActiveChatMenuRight = () => {
    if (channelChoose && channelChoose.state !== Scope.discussion) {
      return (
        <ChannelSettings
          channel={channelChoose}
          socket={socket}
          channels={channels}
          setChannelChoose={setChannelChoose}
          setActiveChatMenu={setActiveChatMenu}
          showChatRight={showChatRight}
          setShowChatRight={setShowChatRight}
        />
      );
    }
  };

  function ftShowChatLeft() {
    if (showChatLeft === true) return classes.ShowChatLeft;
    return classes.HideChatLeft;
  }

  function ftShowChatRight() {
    if (showChatRight === true) return classes.ShowChatRight;
    return classes.HideChatRight;
  }

  return (
    <Fragment>
      <div className={clsx(classes.Chat)}>
        <button
          className={classes.OpenChatLeftButton}
          onClick={() => {
            setShowChatLeft(!showChatLeft);
            showChatRight
              ? setShowChatRight(!showChatRight)
              : setShowChatRight(showChatRight);
          }}
        >
          <span className="material-icons">menu</span>
        </button>
        <div className={clsx(classes.ChatLeft, ftShowChatLeft())}>
          <button
            className={classes.CloseChatLeftButton}
            onClick={() => {
              setShowChatLeft(!showChatLeft);
            }}
          >
            <span className="material-icons">close</span>
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.SearchUserButton)}
            onClick={() => {
              setActiveChatMenu('SearchUser');
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
            }}
          >
            Search user
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.JoinChannelButton)}
            onClick={() => {
              setActiveChatMenu('JoinChannel');
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
            }}
          >
            Join channel
          </button>
          <button
            className={clsx(
              classes.ChatLeftButton,
              classes.CreateChannelButton,
            )}
            onClick={() => {
              setActiveChatMenu('CreateChannel');
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
            }}
          >
            Create channel
          </button>

          <h3 className={clsx(classes.Channels)}>Channels</h3>
          {ftDisplayJoinChannel()}
          <h3 className={clsx(classes.Messages)}>Direct messages</h3>
          {ftDisplayDM()}
        </div>

        <div className={classes.ChatCenter}>{ftActiveChatMenuCenter()}</div>

        <div className={clsx(classes.ChatRight, ftShowChatRight())}>
          {ftActiveChatMenuRight()}
        </div>
      </div>
    </Fragment>
  );
};

export default Chat;
