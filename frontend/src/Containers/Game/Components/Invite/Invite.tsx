import { useState, useEffect } from 'react';
import classes from './Invite.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import api from '../../../../apis/api';
import { IUser } from '../../../../interface/user.interface';

interface Props {
  width: number;
  height: number;
}

function Invite(props: Props) {
  const [listInvites, setListInvites] = useState<any>([]);
  const [actualUser, setActualUser] = useState<IUser>();

  useEffect(() => {
    api
      .get('/game/invite')
      .then((response) => {
        console.log('invites=', response.data);
        setListInvites(response.data);
      })
      .catch((reject) => console.error(reject));
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
        {listInvites &&
          listInvites.map((invitation: any,index:number) => (
            <div className={classes.Invitation} key=>
              <p className={classes.Username} style={{fontSize: props.width / 20}}>{invitation.owner.username}</p>
              <p className={classes.Text}> invite you to play</p>
              <button>Play</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Invite;
