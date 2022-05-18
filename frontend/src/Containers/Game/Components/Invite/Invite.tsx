import { useState, useEffect } from 'react';
import classes from './Invite.module.scss';
import { IGame } from '../../../../interface/game.interface';
import { Socket } from 'socket.io-client';
import getSocket from '../../../Socket';
import api from '../../../../apis/api';
import { IUser } from '../../../../interface/user.interface';
import { BrowserRouter as Router, Link } from 'react-router-dom';

interface Props {
  width: number;
  height: number;
}

function Invite(props: Props) {
  const [listInvites, setListInvites] = useState<any>([]);

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
        fontSize: props.width / 38,
      }}
    >
      <div className={classes.ListInvite}>
        {listInvites &&
          listInvites.map((invitation: any, index: number) => (
            <div className={classes.Invitation} key={index}>
              <div className={classes.Text}>
                <p className={classes.Username} style={{}}>
                  {invitation.owner.username}
                </p>
                <p> invite you to play</p>
              </div>
              <button style={{ fontSize: props.width / 45 }}>
                <Link
                  className={classes.Link}
                  to={'/game/play/room/pong'}
                  state={{
                    from: {
                      opponent: invitation.owner.username,
                      mode: invitation.mode,
                    },
                  }}
                >
                  Play
                </Link>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Invite;
