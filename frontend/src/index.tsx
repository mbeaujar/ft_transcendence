import React, { useEffect, useState } from 'react';
import ReactDOM, { unstable_renderSubtreeIntoContainer } from 'react-dom';
import axios from 'axios';
import { useCookies, CookiesProvider } from 'react-cookie';

const apiAxios = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

//localhost:3000/api/auth/login'

const Button = (props: any) => {
  return (
    <div>
      <button onClick={props.onClick}>{props.text}</button>
    </div>
  );
};

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<any>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const [friends, setFriends] = useState<any>(null);

  return (
    <div>
      {user != null ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <p>{user?.username}</p>
          <p>{user?.id}</p>
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <Button
          text="LOGIN"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/login';
          }}
        />
        <Button
          text="LOGOUT"
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/logout';
          }}
        />
        <Button
          text="STATUS"
          onClick={() => {
            apiAxios
              .get('/auth/status', { withCredentials: true })
              .then(response => {
                console.log(response.data);
                setUser(response.data);
              })
              .catch(() => setUser(null));
          }}
        />
        <Button
          text="FRIENDS"
          onClick={() => {
            apiAxios
              .get('/users/add', { withCredentials: true })
              .then(response => {
                console.log(response);
                // setFriends(response.data);
              })
              .catch(reject => {
                console.log(reject);
                // setFriends(null);
              });
          }}
        />
        <Button
          text="DELETE"
          onClick={() => {
            apiAxios
              .delete('/users/delete', { withCredentials: true })
              .catch(reject => console.log(reject));
          }}
        />
        <form
          onSubmit={e => {
            e.preventDefault();
            apiAxios
              .get(`/users/${searchUser}`)
              .then(response => console.log(response.data))
              .catch(reject => console.log('Error find user:', reject));
            setSearchUser('');
          }}
        >
          <input
            type="text"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.querySelector('#root')
);
