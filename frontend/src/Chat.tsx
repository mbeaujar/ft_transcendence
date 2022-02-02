import React, { useEffect, useState } from 'react';
import { SocketHandler } from './Socket';
import { IUser } from './interface/user.interface';

const socket = new SocketHandler('http://localhost:3000');

const Chat: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [listMessage, setListMessage] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    socket.handleEvent('message', ({ data }) => {
      setListMessage(prevArray => [...prevArray, data?.data]);
    });

    socket.handleEvent('channels', data => {
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
              admin: false,
              owner: true,
              user: {
                username: 'mbeaujar',
                id: 74632,
                avatar: 'https://cdn.intra.42.fr/users/mbeaujar.jpg',
              },
            });
            setName('');
          }}
        >
          +
        </button>
      </div>
      <br />
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            socket.emitEvent('message', { data: text });
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
        {/* <ul>{renderedList}</ul> */}
      </div>
      <br />
      <div>
        <button
          onClick={() => {
            socket.emitEvent('paginateChannels', { page: 1, limit: 10 });
          }}
        >
          Channel List
        </button>
      </div>
    </div>
  );
};

export default Chat;
