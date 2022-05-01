import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Game from "./Containers/Game/Game.module";
import Chat from "./Containers/Chat/Chat.module";
import Profile from "./Containers/Profile/Profile.module";
import Header from "./Containers/Header/Header.module";
import OtherUserProfile from "./Containers/OtherUserProfile/OtherUserProfile.module";
import { IUser } from "./interface/user.interface";
import api from "./apis/api";
import googleAuthImg from "./assets/Google_Authenticator_for_Android_icon.png";

export interface IMainProps {
  user: IUser;
  refresh: number;
  setRefresh: (i: number) => void;
}

function MainApp(props: IMainProps) {
  const { user, refresh, setRefresh } = props;
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/Game" element={<Game />} />
      <Route
        path="/Chat"
        element={<Chat user={user} refresh={refresh} setRefresh={setRefresh} />}
      />
      <Route
        path="/Profile"
        element={
          <Profile user={user} refresh={refresh} setRefresh={setRefresh} />
        }
      />
      <Route
        path="/OtherUserProfile/:name"
        element={<OtherUserProfile user={user} />}
      />
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

  function handleSubmitForm2faCode(event: any) {
    api
      .post("/auth/2fa/authenticate", { code: twofaCode })
      .then((response) => window.location.reload())
      .catch((reject) => {
        toast.error("Wrong code");
      });
  }

  function handleChange2faCode(event: any) {
    var value = event.target.value;
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
            <button onClick={(event) => handleSubmitForm2faCode(event)}>
              Connect
            </button>
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
