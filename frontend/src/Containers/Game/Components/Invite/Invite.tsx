import { useState, useEffect } from 'react';
import classes from './Invite.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import api from '../../../../apis/api';

interface Props {
  width: number;
  height: number;
}

function Invite(props: Props) {
  const [invites, setInvites] = useState<any>([]);

  useEffect(() => {
    api
      .get('/game/invite')
      .then(response => {
        console.log('invites=', response.data);
        setInvites(response.data);
      })
      .catch(reject => console.error(reject));
  }, []);

  useEffect(() => {}, []);

  return (
    <div
      className={classes.Invite}
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.width / 20,
      }}
    >
      <div className={classes.ListInvite}>
        {/*listGame && listGame.map((game:IGame)=>{

      })*/}
      </div>
    </div>
  );
}

export default Invite;
