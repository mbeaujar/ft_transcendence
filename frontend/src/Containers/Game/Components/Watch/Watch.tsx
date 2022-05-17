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
  const [listGame, setListGame] = useState<[IGame | null]>([null]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketEffect = getSocket('game');
    socketEffect.on('listAllGame', (data: any) => {
      console.log(data);
      setListGame(data);
    });

    socketEffect.emit('listGame');
    setSocket(socketEffect);
    return () => {
      if (socketEffect && socketEffect.connected === true) {
        socketEffect.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log('list', listGame);
  }, [listGame]);

  return (
    <div
      className={classes.Watch}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 20,
      }}
    >
      <div className={classes.ListGame}>
        {/*listGame && listGame.map((game:IGame)=>{

      })*/}
      </div>
    </div>
  );
}

export default WatchGame;
