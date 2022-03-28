import React, { useEffect, useState } from 'react';
import Input from './Input';
import { WebSocket } from './Socket';
import { IUser } from '../interface/user.interface';
import { IChannel } from '../interface/channel.interface';
import { IMessage } from '../interface/message.interface';
import CreateChannel from './CreateChannel';
import { Scope } from '../interface/scope.enum';
import { IJoinChannel } from '../interface/join-channel.interface';
import './Chat.css';
import api from '../../apis/api';

const ws = new WebSocket('http://localhost:3000/chat');

interface Props {
  user: IUser;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userid, setUserid] = useState<string>('');
  const [user, setUser] = useState<IUser>();

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

    ws.socket.on('currentChannel', data => {
      console.log('users channel', data.users);
      setChannelChoose(data);
    });

    ws.socket.on('memberChannel', data => {
      console.log('member', data);
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
            const joinChannel: IJoinChannel = {
              channel,
            };
            console.log('users', channel.users);
            if (channel.state === Scope.protected) {
              Object.assign(joinChannel, { password: prompt('password') });
            }
            ws.socket.emit('joinChannel', joinChannel);
            ws.socket.emit('memberChannel', channel);
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
      <button
        onClick={() => {
          ws.socket.emit('getAllChannels');
        }}
      >
        all channels
      </button>
      <button onClick={() => {}}>block mael</button>
      <button
        onClick={() => {
          ws.socket.emit('leaveChannel', channelChoose);
          setChannelChoose(null);
        }}
      >
        leave channel
      </button>
      <CreateChannel
        user={props.user}
        socketEmit={(channel: IChannel) => {
          ws.socket.emit('createChannel', channel);
        }}
      />
      <br />
      <p>
        Current channel: {channelChoose?.name ? channelChoose.name : 'none'}
      </p>

      <button
        onClick={() => {
          api
            .get(`/users/${userid}`)
            .then(response => setUser(response.data))
            .catch(reject => console.log(reject));
        }}
      >
        fill user
      </button>

      <button
        onClick={() => {
          const channel = { name: 'blabla', state: 3, users: [], password: '' };
          ws.socket.emit('createDiscussion', {
            user,
            channel,
          });
        }}
      >
        CREATE DISCUSSION
      </button>
      <Input label="user id" onSubmit={(text: string) => setUserid(text)} />
      <Input
        label="send Message"
        onSubmit={(text: string) => {
          const message: IMessage = {
            text,
            user: props.user,
          };
          if (channelChoose !== null) {
            Object.assign(message, { channel: channelChoose });
          }
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
