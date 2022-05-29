import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import Header from '../Header/Header';
import { IUser } from '../../interface/user.interface';
import api from '../../apis/api';
import googleAuthImg from '../../assets/Google_Authenticator_for_Android_icon.png';
import useLocalStorage from 'use-local-storage';
import MainApp from './MainApp/MainApp';
import { checkIsLogged, is2fa, getUser } from '../../utils';
import { useApp, useAuth } from '../../hooks';
import { UserContext } from '../../context';

const NotLogged = () => (
  <>
    {/* <Header show={1} /> */}
    <h1 className="unauthorized">You must log in to access this feature</h1>
  </>
);

const GoogleAuthentificator = ({
  twofaCode,
  handleChange2faCode,
  handleSubmitForm2faCode,
}: {
  twofaCode: string;
  handleChange2faCode: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSubmitForm2faCode: () => Promise<void>;
}) => {
  return (
    <>
      {/* <Header show={1} /> */}
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
  );
};

const App: React.FC = (): JSX.Element => {
  const { setTheme, theme } = useApp();

  const {
    isLogged,
    googleAuth,
    user,
    twofaCode,
    handleChange2faCode,
    handleSubmitForm2faCode,
    need2FaCode,
    handleLogout,
    isLoading,
    twoFaDone,
  } = useAuth();
  console.log({ isLogged, user, googleAuth });
  return (
    <div className="App Layout" data-theme={theme}>
      <UserContext.Provider
        value={{ isLogged, googleAuth, user, handleLogout }}
      >
        <Header show={2} />
        {isLoading && <div>loading...</div>}

        {!isLoading && need2FaCode && !isLogged && !twoFaDone && (
          <GoogleAuthentificator
            handleChange2faCode={handleChange2faCode}
            handleSubmitForm2faCode={handleSubmitForm2faCode}
            twofaCode={twofaCode}
          />
        )}
        {!isLoading && isLogged && twoFaDone && (
          <MainApp theme={theme} setTheme={setTheme} />
        )}

        {!isLoading && !isLogged && need2FaCode === null && <NotLogged />}
        <ToastContainer theme="colored" autoClose={1500} />
      </UserContext.Provider>
    </div>
  );
};

export default App;
