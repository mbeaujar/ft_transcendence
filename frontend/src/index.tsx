import React, { useEffect, useState } from 'react';
import ReactDOM, { unstable_renderSubtreeIntoContainer } from 'react-dom';
import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  withCredentials: true,
});

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState(null);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            window.location.href = 'http://127.0.0.1:3000/api/auth/login';
          }}
        >
          LOGIN
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            window.location.href = 'http://127.0.0.1:3000/api/auth/logout';
          }}
        >
          LOGOUT
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            apiAxios
              .get('/auth/status', { withCredentials: true })
              .then(reponse => setUser(reponse.data))
              .catch(reject => console.log('Error:', reject));
          }}
        >
          STATUS
        </button>
        {user}
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root')
);
