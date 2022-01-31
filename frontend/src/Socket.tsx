import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: Cookies.get('access_token'),
      },
    },
  },
};
const socket = io('http://localhost:3000', socketOptions);

const Socket: React.FC = (): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  // const [cookies, setCookies] = useCookies(['access_token']);

  // Cookies.set('test', 'mael');
  // console.log('cook', Cookies.get('access_token'));
  // console.log('cook', cookies);
  const submitNewMessage = (pass: any) => {
    socket.emit('message', { data: pass });
  };

  const handleMessage = (messa: any) => {
    // console.log('mess:', messa);
    setMessages(prevArray => [...prevArray, messa.data]);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('conn:', socket.id);
    });
    socket.on('message', data => {
      // console.log('log:', data);
      handleMessage(data);
    });
    return () => {
      socket.on('disconnect', () => {});
    };
  }, []);

  const renderList = messages.map((mess, index) => {
    return <li key={index}>{mess}</li>;
  });

  // console.log('li:', <li>Test</li>);

  // console.log('render:', renderList);

  return (
    <div>
      <ul>{renderList}</ul>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button
        onClick={() => {
          submitNewMessage(message);
          setMessage('');
        }}
      >
        send
      </button>
    </div>
  );
};

export default Socket;
