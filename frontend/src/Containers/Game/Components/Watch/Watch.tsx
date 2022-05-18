import { useState, useEffect } from 'react';
import classes from './Watch.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';

interface Props {
  width: number;
  height: number;
}

function WatchGame(props: Props) {
  const [listGame, setListGame] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketEffect = getSocket('game');
    socketEffect.on('listAllGame', (data: any) => {
      setListGame(data.matchs);
    });

    // emit -> problem
    socketEffect.emit('listGame');
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log('list=', listGame);
  }, [listGame]);

  return (
    <div
      className={classes.Watch}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 50,
      }}
    >
      <div className={classes.ListGame}>
        {listGame &&
          listGame.map((game: any, index: number) => (
            <div className={classes.Game} key={index}>
              <p className={classes.Username} style={{}}>
                {game.players[0].user.username} vs{' '}
                {game.players[1].user.username}
              </p>
              <button style={{ fontSize: props.width / 45 }}>Watch</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WatchGame;
