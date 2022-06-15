/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IUser } from '../../../interface/user.interface';
import Chat from '../../Chat/Chat';
import Invite from '../../Game/Components/Invite/Invite';
import Play from '../../Game/Components/Play/Play';
import Pong from '../../Game/Components/Pong/Pong';
import Room from '../../Game/Components/Room/Room';
import Test from '../../Game/Components/Test/Test';
import useWindowSize from '../../Game/Components/useWindow/useWindowSize';
import WatchGame from '../../Game/Components/Watch/Watch';
import Game from '../../Game/Game';
import OtherUserProfile from '../../OtherUserProfile/OtherUserProfile';
import Profile from '../../Profile/Profile';

export interface IMainProps {
  user: IUser;
  theme: string;
  setTheme: (value: string) => void;
}

let WIDTH: number;
let HEIGHT: number;

function defineCanva() {
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
    defineCanva();
  }, [WindowSize]);

  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route path="/game" element={<Game width={WIDTH} height={HEIGHT} />} />
      <Route
        path="/game/watch"
        element={<WatchGame width={WIDTH} height={HEIGHT} user={props.user} />}
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
      <Route
        path="*"
        element={
          <html>
            <body>
              <br />
              <br />
              <h1>404 NOT FOUND</h1>
            </body>
          </html>
        }
      />
    </Routes>
  );
}

export default MainApp;
