import React, { useEffect, useState } from 'react';
import Input from './Input';
import { WebSocket } from './Socket';
import { IUser } from '../interface/user.interface';
import { IChannel } from '../interface/channel.interface';
import { IMessage } from '../interface/message.interface';
import './Chat.css';

const ws = new WebSocket('http://localhost:3000');

interface Props {
  user: IUser;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel>(channels[0]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  /** Listen event from backend socket */
  useEffect(() => {
    ws.socket.on('channels', data => {
      setChannels(data);
    });

    ws.socket.on('messages', data => {
      console.log('messages', data);
      setMessages(data);
    });

    ws.socket.on('messageAdded', data => {
      setMessages(prev => [...prev, data]);
    });

    ws.socket.emit('getAllChannels');
  }, []);

  useEffect(() => {
    console.log('list of channels', channels);
  }, [channels]);

  const renderedChannels = channels.map(channel => {
    return (
      <div key={channel.id}>
        <button
          onClick={() => {
            // ws.socket.emit('leaveChannel');
            const password = prompt('password') || '';
            const joinChannel: IChannel = {
              id: channel.id,
              name: channel.name,
              state: channel.state,
              password,
              users: channel.users,
            };
            ws.socket.emit('joinChannel', joinChannel);
            setChannelChoose(channel);
          }}
        >
          {channel.name}
        </button>
      </div>
    );
  });

  const renderedMessages = messages.map(message => {
    const isUserMessage =
      message.user.id === props.user.id ? 'message-right' : 'message-left';
    return (
      <div key={message.id} className={`message ${isUserMessage}`}>
        <p style={{ marginLeft: 10 }}>
          {message.user.username}
          <br />
          {message.text}
        </p>
      </div>
    );
  });

  return (
    <div>
      <Input
        label="Create channel"
        onSubmit={(text: string) => {
          const state = parseInt(prompt('state') || '0');
          const password = prompt('password') || '';
          const channel: IChannel = {
            name: text,
            users: [],
            state,
            password,
          };
          ws.socket.emit('createChannel', channel);
        }}
      />
      <br />
      <Input
        label="send Message"
        onSubmit={(text: string) => {
          const message: IMessage = {
            text,
            user: props.user,
            channel: channelChoose,
          };
          ws.socket.emit('addMessage', message);
        }}
      />
      <div className="container">
        <div className="block-left">{renderedChannels}</div>
        <div className="block-right">{renderedMessages}</div>
      </div>
    </div>
  );
};

export default Chat;
