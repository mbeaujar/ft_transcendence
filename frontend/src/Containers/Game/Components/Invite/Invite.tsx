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
  const [actualUser,setActualUser]=useState<IUser>()

  useEffect(() => {
    api
      .get('/game/invite')
      .then(response => {
        console.log('invites=', response.data);
        setListInvites(response.data);
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
        {listInvites && listInvites.map((invitation:any)=>{
                api
                .get(`/users/${invitation.owner}`)
                .then((response) => setActualUser(response.data))
                .catch();
                (<p>{actualUser?.username}</p>)
      })}
      </div>
    </div>
  );
}

export default Invite;
