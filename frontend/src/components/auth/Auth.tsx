import React from 'react';
import { IUser } from '../interface/user.interface';
import api from '../../apis/api';
import './Auth.css';
import TwoAuth from './TwoAuth';

const loginPath = 'http://localhost:3000/api/auth/login';
const logoutPath = 'http://localhost:3000/api/auth/logout';

interface Props {
  user?: IUser;
  setUser?: any;
}

const Auth: React.FC<Props> = (props: Props): JSX.Element => {
  return (
    <div>
      <div className="container">
        <button
          onClick={() => {
            api
              .get('/users/leaderboard')
              .then(resp => console.log(resp.data))
              .catch(reject => console.error(reject));
          }}
        >
          Leaderboard
        </button>
        <button
          onClick={() => {
            api
              .get('/users/ranking')
              .then(resp => console.log(resp.data))
              .catch(reject => console.error(reject));
          }}
        >
          ranking
        </button>
        {props.user ? <p>{props.user.username}</p> : <p>Not authenticated</p>}
        <button
          onClick={() => {
            window.location.href = loginPath;
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            window.location.href = logoutPath;
          }}
        >
          Logout
        </button>
      </div>
      <TwoAuth user={props.user} setUser={props.setUser} />
    </div>
  );
};

export default Auth;
