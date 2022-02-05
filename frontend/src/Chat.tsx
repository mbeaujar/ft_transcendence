import React, { useEffect, useState } from 'react';
import { SocketHandler } from './Socket';
import { IUser } from './interface/user.interface';

const socket = new SocketHandler('http://localhost:3000');

interface IChannel {
  items: any[];
  meta: any;
}

export interface IMessage {
  id?: number;
  text: string;
  user: IUser;
  channel: IChannel;
  created_at: Date;
  updated_at: Date;
}

const Chat: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [channelId, setChannelId] = useState<string>('');
  const [listMessage, setListMessage] = useState<string[]>([]);
  const [channels, setChannels] = useState<IChannel>();

  const renderedList = listMessage.map((message, index) => {
    return <li key={index}>{message}</li>;
  });

  useEffect(() => {
    // socket.receiveEvent('message', data => {
    //   setListMessage(prevArray => [...prevArray, data]);
    // });

    socket.receiveEvent('messages', data => {
      console.log('messages', data);
    });

    socket.receiveEvent('channels', data => {
      console.log('data channels', data);
      setChannels(data);
    });
  }, []);

  return (
    <div>
      <div>
        <p>Create channel</p>
        <label>name: </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          onClick={() => {
            socket.addChannel(name, {
              username: 'mbeaujar',
              id: 74632,
              avatar: 'https://cdn.intra.42.fr/users/mbeaujar.jpg',
            });
            setName('');
          }}
        >
          +
        </button>
      </div>
      <br />
      <div>
        <button
          onClick={() => {
            socket.sendEvent('paginateChannels', {
              page: 1,
              limit: 10,
            });
          }}
        >
          Get all channel for user login
        </button>
        <div
          style={{
            width: '100vw',
            height: 10,
            backgroundColor: 'black',
            marginTop: 10,
          }}
        ></div>
      </div>

      <div>
        <p>Choose channel </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            socket.sendEvent('joinChannel', channels?.items[0]);
          }}
        >
          <label>id: </label>
          <input
            type="text"
            value={channelId}
            onChange={e => setChannelId(e.target.value)}
          />
        </form>
      </div>

      <div>
        <p>Discussion</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            const newMessage: IMessage = {
              text,
            };
            socket.sendEvent('messages', text);
            setText('');
          }}
        >
          <label>message: </label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </form>
        <ul>{renderedList}</ul>
      </div>
    </div>
  );
};

export default Chat;
