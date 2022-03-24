import React, { useEffect } from 'react';
import { WebSocket } from '../Chat/Socket.module';

const ws = new WebSocket('http://localhost:3000/game');

// emit -> envoyer
// socket.on -> recevoir

const Game = () => {
  useEffect(() => {
    // Setup listener
    ws.socket.on('pong', data => {
      console.log('from server:', data);
    });
  }, []);

  return (
    <div>
      <p>Game</p>
      <button
        onClick={() => {
          // send event to backend
          ws.socket.emit('ping', { body: 'salut' });
        }}
      >
        Ping the server
      </button>
      <button
        onClick={() => {
          ws.socket.emit('createGame');
        }}
      >
        create a game
      </button>
      <button
        onClick={() => {
          ws.socket.emit('resetPoint');
        }}
      >
        refresh
      </button>
    </div>
  );
};

export default Game;
