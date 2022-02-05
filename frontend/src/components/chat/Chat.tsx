import React, { useEffect, useState } from 'react';
import api from '../../apis/api';
import Input from './Input';
import { WebSocket } from './Socket';
import { IUser } from '../interface/user.interface';
import { IChannel } from '../interface/channel.interface';

import './Chat.css';
import { IMessage } from '../interface/message.interface';

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
  }, []);

  useEffect(() => {
    console.log('list of channels', channels);
  }, [channels]);

  const renderedChannels = channels.map(channel => {
    return (
      <div key={channel.id}>
        <button
          onClick={() => {
            ws.socket.emit('joinChannel', channel);
            setChannelChoose(channel);
          }}
        >
          {channel.name}
        </button>
      </div>
    );
  });

  const renderedMessages = messages.map(message => {
    return (
      <div key={message.id}>
        <p>{message.text}</p>
      </div>
    );
  });

  return (
    <div>
      <Input
        label="Create channel "
        onSubmit={(text: string) => {
          const channel: IChannel = {
            name: text,
            users: [],
          };
          ws.socket.emit('createChannel', channel);
        }}
      />
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
