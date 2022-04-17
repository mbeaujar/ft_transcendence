import React, { useEffect, useState } from "react";
import api from "../../../../apis/api";
import Avatar from "../Avatar/Avatar";
import classes from "./Settings.module.scss";
import styles from "./Profile.module.scss";
import { IUser } from "../../../../interface/user.interface";
import Dropdown from "./Components/Dropdown/Dropdown.module";
import Username from "./Components/Username/Username";

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: any;
}

const Settings: React.FC<Props> = (props: Props): JSX.Element => {
  /*const [activeUsernameBottom, setActiveUsernameBottom] =
    useState<boolean>(true);*/
  const [activeAvatarBottom, setActiveAvatarBottom] = useState<boolean>(true);
  //const [newName, setNewName] = useState<string>(props.user?.username);
  const [selectedFileName, setSelectedFileName] =
    useState<string>("Choose a file...");
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [refresh, setRefresh] = useState<number>(0);
  const [refreshImg, setRefreshImg] = useState<number>(0);
  const [avatarImg, setAvatarImg] = useState<any>();
  const [valueEnableDoubleAuth, setValueEnableDoubleAuth] = useState(
    props.user.isTwoFactorEnabled ? "Yes" : "no"
  );
  const [qrcode, setQrcode] = useState<any>(null);
  const [twofaCode, setTwofaCode] = useState<string>("");
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    "Enter the 6 digit code"
  );

  useEffect(() => {
    if (
      valueEnableDoubleAuth == "Yes" &&
      props.user.isTwoFactorEnabled == false
    ) {
      api
        .post("/auth/2fa/generate", {}, { responseType: "blob" })
        .then((response) => setQrcode(response.data))
        .catch((reject) => console.log(reject));
    }

    // props.user.username = newName;
    props.setRefresh(props.refresh + 1);

    if (refreshImg == 0) {
      api
        .get(`/users/avatar/${props.user.avatarId}`, {
          responseType: "blob",
        })
        .then((response) => setAvatarImg(URL.createObjectURL(response.data)))
        .catch((reject) => console.log(reject));
    }
    setRefreshImg(1);
  }, [refresh, uploadedFile, valueEnableDoubleAuth]);

  //Username
  /*function handleSubmitFormUsername(event: any) {
    api
      .post('/users/username', { username: newName })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
    setActiveUsernameBottom(!activeUsernameBottom);
    event.preventDefault();
  }

  function handleChangeUsername(event: any) {
    var value = event.target.value;
    setNewName(value);
  }

  function showUsernameBottom() {
    if (activeUsernameBottom === true) return classes.ShowUsernameBottom;
    else return classes.HideUsernameBottom;
  }

  function showUsernameBottomChange() {
    if (activeUsernameBottom === false) return classes.ShowUsernameBottomChange;
    else return classes.HideUsernameBottomChange;
  }*/

  //Avatar
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleClick = (event: any) => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  const changeAvatarImg = (event: any) => {
    if (event.target.files) {
      setUploadedFile(event.target.files[0]);
      setAvatarImg(URL.createObjectURL(event.target.files[0]));
      setSelectedFileName(event.target.files[0].name);
    }
  };

  const validNewAvatar = () => {
    setActiveAvatarBottom(!activeAvatarBottom);
    setSelectedFileName("Choose a file...");
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("file", uploadedFile, selectedFileName);
      api
        .post("/users/avatar/", formData)
        .then((response) => setRefresh(refresh + 1))
        .catch((reject) => console.log(reject));
    }
    setUploadedFile(null);
  };

  const noValidNewAvatar = () => {
    setActiveAvatarBottom(!activeAvatarBottom);
    setSelectedFileName("Choose a file...");
    setUploadedFile(null);
    api
      .get(`/users/avatar/${props.user.avatarId}`, {
        responseType: "blob",
      })
      .then((response) => setAvatarImg(URL.createObjectURL(response.data)))
      .catch((reject) => console.log(reject));
  };

  function showAvatarBottom() {
    if (activeAvatarBottom === true) return classes.ShowAvatarBottom;
    else return classes.HideAvatarBottom;
  }

  function showAvatarBottomInChange() {
    if (activeAvatarBottom === false) return classes.ShowAvatarBottomInChange;
    else return classes.HideAvatarBottomInChange;
  }

  //Google authenticator
  const itemsGoogleAuth = [
    { id: 1, value: "Yes" },
    { id: 2, value: "No" },
  ];

  function dropdownIndex() {
    if (props.user.isTwoFactorEnabled == false) return 1;
    return 0;
  }

  function handleSubmitFormEnable2faInProgressCode(event: any) {
    api
      .post("/auth/2fa/enable", { code: twofaCode })
      .then((response) => {
        setTwofaCode("");
        console.log("success");
        props.user.isTwoFactorEnabled = true;
        setRefresh(refresh + 1);
      })
      .catch((reject) => {
        setTwofaCode("");
        console.log("failure");
        setInputPlaceholder("Wrong code");
      });
    setTwofaCode("");
  }

  function handleChangeEnable2faInProgressCode(event: any) {
    if (twofaCode === "Wrong code!") {
      console.log(twofaCode);
      setTwofaCode("");
    }
    var value = event.target.value;
    setTwofaCode(value);
  }

  function handleSubmitFormDisable2faInProgressCode(event: any) {
    api
      .post("/auth/2fa/disable", { code: twofaCode })
      .then((response) => {
        setTwofaCode("");
        console.log("success");
        props.user.isTwoFactorEnabled = false;
        setRefresh(refresh + 1);
      })
      .catch((reject) => {
        setTwofaCode("");
        console.log("failure");
        setInputPlaceholder("Wrong code");
      });
    setTwofaCode("");
  }

  function handleChangeDisable2faInProgressCode(event: any) {
    if (twofaCode === "Wrong code!") {
      console.log(twofaCode);
      setTwofaCode("");
    }
    var value = event.target.value;
    setTwofaCode(value);
  }

  function showDoubleAuthBottom(className: string) {
    if (className == "DoubleAuthEnable2faInProgress") {
      if (
        valueEnableDoubleAuth == "Yes" &&
        props.user.isTwoFactorEnabled == false
      ) {
        return classes.showDoubleAuthEnable2faInProgress;
      }
      return classes.hideDoubleAuthEnable2faInProgress;
    } else if (className == "DoubleAuthDisable2faInProgress") {
      if (
        valueEnableDoubleAuth == "No" &&
        props.user.isTwoFactorEnabled == true
      ) {
        return classes.showDoubleAuthDisable2faInProgress;
      }
      return classes.hideDoubleAuthDisable2faInProgress;
    }
  }

  return (
    <div className={classes.Settings}>
      <div className={classes.SettingsLeft}>
        <Username
          user={props.user}
          refresh={props.refresh}
          setRefresh={props.setRefresh}
        />
        <div className={classes.Avatar}>
          <h3>Avatar</h3>
          <div className={showAvatarBottom()}>
            <Avatar user={props.user} />
            <button onClick={() => setActiveAvatarBottom(!activeAvatarBottom)}>
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div className={showAvatarBottomInChange()}>
            <div className={classes.AvatarImg}>
              <img src={avatarImg} />
            </div>
            <div className={classes.AvatarBottomChange}>
              <button
                className={classes.buttonChooseFile}
                onClick={handleClick}
              >
                <span className="material-icons">backup</span>
                <p>{selectedFileName}</p>
              </button>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={changeAvatarImg}
                style={{ display: "none" }}
              />
              <div className={classes.ButtonsValidation}>
                <button
                  className={classes.ValidNewAvatar}
                  onClick={validNewAvatar}
                >
                  <span className="material-icons">done</span>
                </button>
                <button
                  className={classes.NoValidNewAvatar}
                  onClick={noValidNewAvatar}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.Theme}></div>
      </div>
      <div className={classes.SettingsRight}>
        <div className={classes.DoubleAuth}>
          <h3>Google Authenticator</h3>
          <div className={classes.DoubleAuthMiddle}>
            <Dropdown
              title="Enable google authenticator"
              items={itemsGoogleAuth}
              setValueEnableDoubleAuth={setValueEnableDoubleAuth}
              valueEnableDoubleAuth={valueEnableDoubleAuth}
              dropdownIndex={dropdownIndex()}
            />
          </div>
          <div
            className={showDoubleAuthBottom("DoubleAuthEnable2faInProgress")}
          >
            {qrcode ? <img src={URL.createObjectURL(qrcode)} /> : null}
            <div className={classes.Right}>
              <input
                className={classes.NewName}
                type="text"
                value={twofaCode}
                onChange={(event) => handleChangeEnable2faInProgressCode(event)}
                placeholder={inputPlaceholder}
              />
              <button
                onClick={(event) =>
                  handleSubmitFormEnable2faInProgressCode(event)
                }
              >
                Enable
              </button>
            </div>
          </div>
          <div
            className={showDoubleAuthBottom("DoubleAuthDisable2faInProgress")}
          >
            <div className={classes.Right}>
              <input
                className={classes.NewName}
                type="text"
                value={twofaCode}
                onChange={(event) =>
                  handleChangeDisable2faInProgressCode(event)
                }
                placeholder={inputPlaceholder}
              />
              <button
                onClick={(event) =>
                  handleSubmitFormDisable2faInProgressCode(event)
                }
              >
                Disable
              </button>
            </div>
          </div>
        </div>
        <div className={classes.UsersBlock}>
          <h3>Blocked users</h3>
        </div>
      </div>
    </div>
  );
};

export default Settings;
