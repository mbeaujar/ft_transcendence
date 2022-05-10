import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./Containers/Game/Game";
import Pong from "./Containers/Game/Components/Pong/Pong";
import Chat from "./Containers/Chat/Chat";
import Profile from "./Containers/Profile/Profile";
import Header from "./Containers/Header/Header";
import OtherUserProfile from "./Containers/OtherUserProfile/OtherUserProfile";
import { IUser } from "./interface/user.interface";
import api from "./apis/api";
import googleAuthImg from "./assets/Google_Authenticator_for_Android_icon.png";

export interface IMainProps {
  user: IUser;
  refresh: number;
  setRefresh: (value: number) => void;
}

function MainApp(props: IMainProps) {
  const { user, refresh, setRefresh } = props;
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/game" element={<Game />} />
      {/* <Route path="/game/pong" element={<Pong />} /> */}
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
  const [twofaCode, setTwofaCode] = useState<string>("");
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    "Enter the 6 digit code"
  );

  useEffect(() => {
    api
      .get("/auth/status")
      .then((response) => setUser(response.data))
      .catch((reject) => console.error(reject));

    api
      .get("/auth/authenticated")
      .then((response) => setGoogleAuth(response.data))
      .catch((reject) => {
        setGoogleAuth(true);
      });
  }, [refresh]);

  function handleSubmitForm2faCode() {
    api
      .post("/auth/2fa/authenticate", { code: twofaCode })
      .then((response) => {
        // Notes: 0 (ZERO)
        // window.location.reload();
      })
      .catch((reject) => {
        toast.error("Wrong code");
      });
  }

  function handleChange2faCode(event: React.FormEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    setTwofaCode(value);
  }

  return (
    <div className="App Layout">
      <Router>
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
          <h1 className="unauthorized">
            You must log in to access this feature
          </h1>
        )}
      </Router>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default App;
