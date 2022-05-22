import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Game from './Containers/Game/Game';
import Watch from './Containers/Game/Components/Watch/Watch';
import Room from './Containers/Game/Components/Room/Room';
import Pong from './Containers/Game/Components/Pong/Pong';
import Play from './Containers/Game/Components/Play/Play';
import Invite from './Containers/Game/Components/Invite/Invite';
import Chat from './Containers/Chat/Chat';
import Profile from './Containers/Profile/Profile';
import Header from './Containers/Header/Header';
import OtherUserProfile from './Containers/OtherUserProfile/OtherUserProfile';
import { IUser } from './interface/user.interface';
import api from './apis/api';
import googleAuthImg from './assets/Google_Authenticator_for_Android_icon.png';
import useWindowSize from './Containers/Game/Components/useWindow/useWindowSize';
import { Socket } from 'socket.io-client';
import Test from './Containers/Game/Components/Test/Test';

export interface IMainProps {
  user: IUser;
  refresh: number;
  setRefresh: (value: number) => void;
}

let WIDTH = 800;
let HEIGHT = 400;

function MainApp(props: IMainProps) {
  const { user, refresh, setRefresh } = props;
  const WindowSize = useWindowSize();

  useEffect(() => {
    if (WindowSize.innerWidth < 160.01) {
      WIDTH = 100;
      HEIGHT = 50;
    } else if (WindowSize.innerWidth < 215.01) {
      WIDTH = 150;
      HEIGHT = 75;
    } else if (WindowSize.innerWidth < 330.01) {
      WIDTH = 200;
      HEIGHT = 100;
    } else if (WindowSize.innerWidth < 430.01) {
      WIDTH = 300;
      HEIGHT = 150;
    } else if (WindowSize.innerWidth < 650.01) {
      WIDTH = 400;
      HEIGHT = 200;
    } else if (WindowSize.innerWidth < 840.01) {
      WIDTH = 600;
      HEIGHT = 300;
    } else if (WindowSize.innerWidth < 1500.01) {
      WIDTH = 800;
      HEIGHT = 400;
    } else if (WindowSize.innerWidth < 2000.01) {
      WIDTH = 1000;
      HEIGHT = 500;
    } else if (WindowSize.innerWidth < 2500.01) {
      WIDTH = 1200;
      HEIGHT = 600;
    } else if (WindowSize.innerWidth < 3000.01) {
      WIDTH = 1600;
      HEIGHT = 800;
    } else {
      WIDTH = 1800;
      HEIGHT = 900;
    }
  }, [WindowSize]);

  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route path="/game" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route
        path="/game/watch"
        element={<Watch width={WIDTH} height={HEIGHT} />}
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
      <Route
        path="/chat"
        element={<Chat user={user} refresh={refresh} setRefresh={setRefresh} />}
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:name" element={<OtherUserProfile />} />
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

  useEffect(() => {
    api
      .get('/auth/status')
      .then((response) => setUser(response.data))
      .catch((reject) => console.error(reject));

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
    <div className="App Layout">
      {/* <Router> */}
      <Header />
      {user ? (
        <MainApp user={user} refresh={refresh} setRefresh={setRefresh} />
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
      {/* </Router> */}
      <ToastContainer theme="colored" autoClose={1500}/>
    </div>
  );
};

export default App;
