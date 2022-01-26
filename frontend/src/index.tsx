import React, { useEffect, useState } from 'react';
import ReactDOM, { unstable_renderSubtreeIntoContainer } from 'react-dom';
import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
});

const App: React.FC = (): JSX.Element => {
  return (
    <div>
      <a href="http://127.0.0.1:3000/api/auth/login">login</a>
      <button
        onClick={() => {
          window.location.href = 'http://127.0.0.1:3000/api/auth/login';
        }}
      >
        LOGIN
      </button>
      <br />
      <a href="http://127.0.0.1:3000/api/auth/logout">logout</a>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root')
);
