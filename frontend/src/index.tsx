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

// `/users/${searchUser}`

const Input = (props: any) => {
  const [searchUser, setSearchUser] = useState<string>('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        apiAxios
          .get(`${props.url}/${searchUser}`)
          .then(response => console.log(response.data))
          .catch(reject => console.log('Error:', reject));
        setSearchUser('');
      }}
    >
      <label>{props.label}: </label>
      <input
        type="text"
        value={searchUser}
        onChange={e => setSearchUser(e.target.value)}
      />
    </form>
  );
};

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<any>(null);
  const [friends, setFriends] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<string>('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        mael: 74632
        <br />
        ramzi: 74728
      </div>
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
              .get('/friends/all', { withCredentials: true })
              .then(response => {
                console.log(response.data);
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <Input label="users" url="/users" />
        <Input label="friends" url="/friends/add" />
        <form
          onSubmit={e => {
            e.preventDefault();
            apiAxios
              .delete(`/friends/${deleteUser}`)
              .then(response => console.log(response.data))
              .catch(reject => console.log(reject));
            setDeleteUser('');
          }}
        >
          <label>Delete friends: </label>
          <input
            type="text"
            value={deleteUser}
            onChange={e => setDeleteUser(e.target.value)}
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
