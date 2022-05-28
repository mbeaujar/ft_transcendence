import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import Header from '../Header/Header';
import { IUser } from '../../interface/user.interface';
import api from '../../apis/api';
import googleAuthImg from '../../assets/Google_Authenticator_for_Android_icon.png';
import useLocalStorage from 'use-local-storage';
import MainApp from './MainApp/MainApp';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();
  const [refresh, setRefresh] = useState<number>(0);
  const [googleAuth, setGoogleAuth] = useState<boolean>(true);
  const [twofaCode, setTwofaCode] = useState<string>('');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    try {
      api
        .get('/auth/status')
        .then((response) => setUser(response.data))
        .catch(() => console.log('error'));
      api
        .get('/auth/authenticated')
        .then((response) => setGoogleAuth(response.data))
        .catch(() => {
          setGoogleAuth(true);
        });
    } catch {
      console.log('error');
    }
  }, [refresh]);

  function handleSubmitForm2faCode() {
    api
      .post('/auth/2fa/authenticate', { code: twofaCode })
      .then(() => {
        setRefresh(refresh + 1);
      })
      .catch(() => {
        toast.error('Wrong code');
      });
  }

  function handleChange2faCode(event: React.FormEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    setTwofaCode(value);
  }

  return (
    <div className="App Layout" data-theme={theme}>
      {user ? (
        <>
          <Header show={2} />
          <MainApp user={user} theme={theme} setTheme={setTheme} />
        </>
      ) : !googleAuth ? (
        <>
          <Header show={1} />
          <div className="DoubleAuth">
            <img src={googleAuthImg} />
            <input
              type="text"
              value={twofaCode}
              onChange={(event) => handleChange2faCode(event)}
              placeholder="Enter the 6 digit code"
            />
            <button onClick={() => handleSubmitForm2faCode()}>Connect</button>
          </div>
        </>
      ) : (
        <>
          <Header show={1} />
          <h1 className="unauthorized">
            You must log in to access this feature
          </h1>
        </>
      )}
      <ToastContainer theme="colored" autoClose={1500} />
    </div>
  );
};

export default App;
