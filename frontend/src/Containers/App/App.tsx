import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import Header from '../Header/Header';
import { IUser } from '../../interface/user.interface';
import api from '../../apis/api';
import googleAuthImg from '../../assets/Google_Authenticator_for_Android_icon.png';
import useLocalStorage from 'use-local-storage';
import MainApp from './MainApp/MainApp';
import { checkIsLogged, is2fa, isLogged } from '../../utils';
import { useApp, useAuth } from '../../hooks';
import { UserContext } from '../../context';

const App: React.FC = (): JSX.Element => {
  const {
    handleChange2faCode,
    handleSubmitForm2faCode,
    setTheme,
    theme,
    twofaCode,
  } = useApp();

  const { isLogged, googleAuth, user } = useAuth();

  return (
    <div className="App Layout" data-theme={theme}>
      {isLogged && user ? (
        <UserContext.Provider value={{ isLogged, googleAuth, user }}>
          <Header show={2} />
          <MainApp user={user} theme={theme} setTheme={setTheme} />
        </UserContext.Provider>
      ) : !googleAuth ? (
        <>
          <Header show={1} />
          <div className="DoubleAuth">
            <img src={googleAuthImg} />
            <input
              type="text"
              value={twofaCode}
              onChange={handleChange2faCode}
              placeholder="Enter the 6 digit code"
            />
            <button onClick={handleSubmitForm2faCode}>Connect</button>
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
