import React, { useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./Chat.module.scss";
import { WebSocket } from "./Socket.module";
import { IUser } from "../../interface/user.interface";
import { IChannel } from "../../interface/channel.interface";
import SearchUser from "./Components/SearchUser/SearchUser.module";
import JoinChannel from "./Components/JoinChannel/JoinChannel.module";
import CreateChannel from "./Components/CreateChannel/CreateChannel.module";
import Discussion from "./Components/Discussion/Discussion.module";
import { IMessage } from "../../interface/message.interface";
import { IJoinChannel } from "../../interface/join-channel.interface";
import ChannelSettings from "./Components/ChannelSettings/ChannelSettings.module";

const ws = new WebSocket("http://localhost:3000/chat");

interface Props {
  user: IUser;
  refresh: any;
  setRefresh: any;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);

  const [channelsJoin, setChannelsJoin] = useState<IChannel[]>([]);
  const [channelsNotJoin, setChannelsNotJoin] = useState<IChannel[]>([]);

  const [activeChatMenu, setActiveChatMenu] = useState<any>(null);

  const [showChatLeft, setShowChatLeft] = useState(true);
  const [showChatRight, setShowChatRight] = useState(false);

  useEffect(() => {
    ws.socket.emit("getAllChannels");

    ws.socket.on("channels", (data) => {
      setChannels(data);
    });

    ws.socket.on("messages", (data) => {
      setMessages(data);
    });

    ws.socket.on("messageAdded", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    ws.socket.on("currentChannel", (data) => {
      setChannelChoose(data);
    });

    ws.socket.on("memberChannel", (data) => {
      console.log("member", data);
    });

    ws.socket.emit("getAllChannels");
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
      channel.users.map((userList: any) => {
        if (userList.user.username === props.user.username) {
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
          ws.socket.emit("joinChannel", joinChannel);
          setShowChatLeft(!showChatLeft);
        }}
      >
        {channel.name}
      </p>
    ));
  };

  const ftActiveChatMenuCenter = () => {
    if (activeChatMenu == null || channelChoose)
      if (channelChoose) {
        return (
          <Discussion
            user={props.user}
            ws={ws}
            channel={channelChoose}
            messages={messages}
            showChatRight={showChatRight}
            setShowChatRight={setShowChatRight}
          />
        );
      } else return <p></p>;
    else if (activeChatMenu === "SearchUser") return <SearchUser />;
    else if (activeChatMenu === "JoinChannel") {
      return (
        <JoinChannel
          user={props.user}
          ws={ws}
          channels={channels}
          channelNotJoin={channelsNotJoin}
        />
      );
    } else if (activeChatMenu === "CreateChannel")
      return (
        <CreateChannel
          user={props.user}
          socketEmit={(channel: IChannel) => {
            ws.socket.emit("createChannel", channel);
          }}
        />
      );
  };

  const ftActiveChatMenuRight = () => {
    if (channelChoose) {
      return (
        <ChannelSettings
          user={props.user}
          channel={channelChoose}
          ws={ws}
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
    <>
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
              setActiveChatMenu("SearchUser");
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
            }}
          >
            Search user
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.JoinChannelButton)}
            onClick={() => {
              setActiveChatMenu("JoinChannel");
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
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
              setActiveChatMenu("CreateChannel");
              setChannelChoose(null);
              setShowChatLeft(!showChatLeft);
            }}
          >
            Create channel
          </button>

          <h3 className={clsx(classes.Channels)}>Channels</h3>
          {ftDisplayJoinChannel()}
          <h3 className={clsx(classes.Messages)}>Messages</h3>
          <p className={classes.ChannelName}>Sommecaise</p>
          <p className={classes.ChannelName}>Ramzi</p>
          <p className={classes.ChannelName}>Hassan</p>
          <p className={classes.ChannelName}>Arthur</p>
          <p className={classes.ChannelName}>Sofiane</p>
          <p className={classes.ChannelName}>Miguel</p>
          <p className={classes.ChannelName}>Yanis</p>
          <p className={classes.ChannelName}>Ramzi Zoukidiev</p>
        </div>

        <div className={classes.ChatCenter}>{ftActiveChatMenuCenter()}</div>

        <div className={clsx(classes.ChatRight, ftShowChatRight())}>
          {ftActiveChatMenuRight()}
        </div>
      </div>
    </>
  );
};

export default Chat;
