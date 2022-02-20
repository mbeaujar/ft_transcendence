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
import CreateChannel from './Components/CreateChannel/CreateChannel.module';

const ws = new WebSocket('http://localhost:3000');

interface Props {
  user: IUser;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

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
  }, [channels]);

  return (
    <>
      <div className={clsx(classes.Chat)}>
        <div className={classes.ChatLeft}>
          <button
            className={clsx(classes.ChatLeftButton, classes.SearchUserButton)}
          >
            Search user
          </button>
          <button
            className={clsx(classes.ChatLeftButton, classes.JoinChannelButton)}
          >
            Join channel
          </button>
          <button
            className={clsx(
              classes.ChatLeftButton,
              classes.CreateChannelButton
            )}
          >
            Create channel
          </button>

          <h3 className={clsx(classes.Channels)}>Channels</h3>
          <p>Channel-1</p>
          <p>Channel-2</p>
          <p>Channel-3</p>
          <h3 className={clsx(classes.Messages)}>Messages</h3>
          <p>Sommecaise</p>
          <p>Ramzi</p>
        </div>

        <div className={classes.ChatCenter}>
        <CreateChannel
        user={props.user}
        socketEmit={(channel: IChannel) => {
          ws.socket.emit('createChannel', channel);
        }}
      />
        </div>

        <div className={classes.ChatRight}></div>
      </div>
    </>
  );
};

export default Chat;
