import { useState, useEffect } from 'react';
import classes from './Invite.module.scss';
// import { IGame } from '../../../../interface/game.interface';
// import { Socket } from 'socket.io-client';
// import getSocket from '../../../Socket';
import api from '../../../../apis/api';
// import { IUser } from '../../../../interface/user.interface';
import { BrowserRouter as Router, Link } from 'react-router-dom';

interface Props {
  width: number;
  height: number;
}

function textGameMode(mode: number) {
  if (mode === 0) return ' classic game';
  else if (mode === 1) return ' paddle reduce game';
  else if (mode === 2) return ' paddle flashing game';
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
        fontSize: props.width / 50,
      }}
    >
      <button
        className={classes.refreshButton}
        onClick={() => {
          api
            .get('/game/invite')
            .then((response) => {
              console.log('invites=', response.data);
              setListInvites(response.data);
            })
            .catch((reject) => console.error(reject));
        }}
      >
        Refresh invite
      </button>
      <div className={classes.ListInvite}>
        {listInvites.length !== 0 ? (
          listInvites.map((invitation: any, index: number) => (
            <div className={classes.Invitation} key={index}>
              <div className={classes.Text}>
                <p className={classes.Username} style={{}}>
                  {invitation.owner.username}
                </p>
                <p> invite you to play {textGameMode(invitation.mode)}</p>
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
          ))
        ) : (
          <p className={classes.NoInvitation}>You don't have any invitation</p>
        )}
      </div>
      <Link to="/game/play" className={classes.Back}>
        Back
      </Link>
    </div>
  );
}

export default Invite;
