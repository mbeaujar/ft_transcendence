import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Game from '../Game/Game';
import Watch from '../Game/Components/Watch/Watch';
import Room from '../Game/Components/Room/Room';
import Pong from '../Game/Components/Pong/Pong';
import Play from '../Game/Components/Play/Play';
import Invite from '../Game/Components/Invite/Invite';
import Chat from '../Chat/Chat';
import Profile from '../Profile/Profile';
import Header from '../Header/Header';
import OtherUserProfile from '../OtherUserProfile/OtherUserProfile';
import { IUser } from '../../interface/user.interface';
import api from '../../apis/api';
import googleAuthImg from '../../assets/Google_Authenticator_for_Android_icon.png';
import useWindowSize from '../Game/Components/useWindow/useWindowSize';
import Test from '../Game/Components/Test/Test';
import useLocalStorage from 'use-local-storage';

export interface IMainProps {
  user: IUser;
  theme: string;
  setTheme: (value: string) => void;
}


let WIDTH:number;
let HEIGHT:number;

function defineCanva()
{
  if (window.innerWidth < 160.01) {
    WIDTH = 100;
    HEIGHT = 50;
  } else if (window.innerWidth < 215.01) {
    WIDTH = 150;
    HEIGHT = 75;
  } else if (window.innerWidth < 330.01) {
    WIDTH = 200;
    HEIGHT = 100;
  } else if (window.innerWidth < 430.01) {
    WIDTH = 300;
    HEIGHT = 150;
  } else if (window.innerWidth < 650.01) {
    WIDTH = 400;
    HEIGHT = 200;
  } else if (window.innerWidth < 840.01) {
    WIDTH = 600;
    HEIGHT = 300;
  } else if (window.innerWidth < 1500.01) {
    WIDTH = 800;
    HEIGHT = 400;
  } else if (window.innerWidth < 2000.01) {
    WIDTH = 1000;
    HEIGHT = 500;
  } else if (window.innerWidth < 2500.01) {
    WIDTH = 1200;
    HEIGHT = 600;
  } else if (window.innerWidth < 3000.01) {
    WIDTH = 1600;
    HEIGHT = 800;
  } else {
    WIDTH = 1800;
    HEIGHT = 900;
  }
}

defineCanva();

function MainApp(props: IMainProps) {
  const { user } = props;
  const WindowSize = useWindowSize();



  useEffect(() => {
    // if (window.innerWidth < 160.01) {
    //   WIDTH = 100;
    //   HEIGHT = 50;
    // } else if (window.innerWidth < 215.01) {
    //   WIDTH = 150;
    //   HEIGHT = 75;
    // } else if (window.innerWidth < 330.01) {
    //   WIDTH = 200;
    //   HEIGHT = 100;
    // } else if (window.innerWidth < 430.01) {
    //   WIDTH = 300;
    //   HEIGHT = 150;
    // } else if (window.innerWidth < 650.01) {
    //   WIDTH = 400;
    //   HEIGHT = 200;
    // } else if (window.innerWidth < 840.01) {
    //   WIDTH = 600;
    //   HEIGHT = 300;
    // } else if (window.innerWidth < 1500.01) {
    //   WIDTH = 800;
    //   HEIGHT = 400;
    // } else if (window.innerWidth < 2000.01) {
    //   WIDTH = 1000;
    //   HEIGHT = 500;
    // } else if (window.innerWidth < 2500.01) {
    //   WIDTH = 1200;
    //   HEIGHT = 600;
    // } else if (window.innerWidth < 3000.01) {
    //   WIDTH = 1600;
    //   HEIGHT = 800;
    // } else {
    //   WIDTH = 1800;
    //   HEIGHT = 900;
    // }
    defineCanva();
  }, [window.innerWidth]);

  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route path="/game" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route
        path="/game/watch"
        element={<Watch width={WIDTH} height={HEIGHT} user={props.user}/>}
      />
      <Route
        path="/game/play"
        element={<Play width={WIDTH} height={HEIGHT} />}
      />
      <Route
        path="/game/play/invite"
        element={<Invite width={WIDTH} height={HEIGHT} />}
      />
      <Route
        path="/game/play/room"
        element={<Room width={WIDTH} height={HEIGHT} />}
      />
      <Route
        path="/game/play/room/pong"
        element={<Pong width={WIDTH} height={HEIGHT} user={user} />}
      ></Route>
      <Route path="/chat" element={<Chat user={user} />} />
      <Route
        path="/profile"
        element={
          <Profile
            menu="Profile"
            theme={props.theme}
            setTheme={props.setTheme}
          />
        }
      />
      <Route
        path="/profile/stats"
        element={
          <Profile menu="Stats" theme={props.theme} setTheme={props.setTheme} />
        }
      />
      <Route
        path="/profile/friends"
        element={
          <Profile
            menu="Friends"
            theme={props.theme}
            setTheme={props.setTheme}
          />
        }
      />
      <Route
        path="/profile/leaderboard"
        element={
          <Profile
            menu="Leaderboard"
            theme={props.theme}
            setTheme={props.setTheme}
          />
        }
      />
      <Route
        path="/profile/settings"
        element={
          <Profile
            menu="Settings"
            theme={props.theme}
            setTheme={props.setTheme}
          />
        }
      />
      <Route path="/profile/stats/:name" element={<OtherUserProfile />} />
      <Route path="*" element={<h1>404 not found</h1>} />
    </Routes>
  );
}

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();
  const [refresh, setRefresh] = useState<number>(0);
  const [googleAuth, setGoogleAuth] = useState<boolean>(true);
  const [twofaCode, setTwofaCode] = useState<string>('');
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    'Enter the 6 digit code',
  );

  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    api
      .get('/auth/status')
      .then((response) => setUser(response.data))
      .catch(() => console.log('error'));
    api
      .get('/auth/authenticated')
      .then((response) => setGoogleAuth(response.data))
      .catch((reject) => {
        setGoogleAuth(true);
      });
  }, [refresh]);

  function handleSubmitForm2faCode() {
    api
      .post('/auth/2fa/authenticate', { code: twofaCode })
      .then((response) => {
        // Notes: 0 (ZERO)
        // window.location.reload();
      })
      .catch((reject) => {
        toast.error('Wrong code');
      });
  }

  function handleChange2faCode(event: React.FormEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    setTwofaCode(value);
  }

  

  return (
    <div className="App Layout" data-theme={theme}>
      <Header />
      {user ? (
        <MainApp user={user} theme={theme} setTheme={setTheme} />
      ) : !googleAuth ? (
        <div className="DoubleAuth">
          <img src={googleAuthImg} />
          <input
            type="text"
            value={twofaCode}
            onChange={(event) => handleChange2faCode(event)}
            placeholder={inputPlaceholder}
          />
          <button onClick={() => handleSubmitForm2faCode()}>Connect</button>
        </div>
      ) : (
        <h1 className="unauthorized">You must log in to access this feature</h1>
      )}
      <ToastContainer theme="colored" autoClose={1500} />
    </div>
  );
};

export default App;
