import React, { useEffect, useState } from 'react';
import { SocketHandler } from './Socket';
import { IUser } from './interface/user.interface';

const socket = new SocketHandler('http://localhost:3000');

const Chat: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [page, setPage] = useState<string>('');
  const [listMessage, setListMessage] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    socket.receiveEvent('message', data => {
      setListMessage(prevArray => [...prevArray, data]);
    });

    socket.receiveEvent('channels', data => {
      console.log('data channels', data);
    });

    return () => socket.disconnect();
  }, []);

  const renderedList = listMessage.map((message, index) => {
    return <li key={index}>{message}</li>;
  });

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
        <label> page: </label>
        <input
          type="text"
          value={page}
          onChange={e => setPage(e.target.value)}
        />
        <button
          onClick={() => {
            socket.sendEvent('paginateChannels', {
              page: parseInt(page),
              limit: 10,
            });
          }}
        >
          Get page info
        </button>
      </div>
      <br />
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            socket.sendEvent('message', text);
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
