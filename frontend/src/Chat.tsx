import React, { useEffect, useState } from 'react';
import { SocketHandler } from './Socket';
import { IUser } from './interface/user.interface';

const socket = new SocketHandler('http://localhost:3000');

const user: IUser = {
  username: 'mbeaujar',
  id: 74632,
  avatar: 'https://cdn.intra.42.fr/users/mbeaujar.jpg',
};

const Chat: React.FC = (): JSX.Element => {
  const [text, setText] = useState<string>('');
  const [listMessage, setListMessage] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    socket.handleEvent('message', ({ data }) => {
      setListMessage(prevArray => [...prevArray, data?.data]);
    });

    return () => socket.disconnect();
  }, []);

  const renderedList = listMessage.map((message, index) => {
    return <li key={index}>{message}</li>;
  });

  return (
    <div>
      <div>
        <button
          onClick={() => {
            socket.addChannel('test', user);
          }}
        >
          +
        </button>
      </div>
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
      <ul>{renderedList}</ul>
    </div>
  );
};

export default Chat;
