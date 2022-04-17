import React, { useEffect, useState } from "react";
import api from "../../../../../../apis/api";
import Avatar from "../../../Avatar/Avatar";
import "./AvatarSettings.scss";

function AvatarSettings(props: any) {
  const [activeAvatarBottom, setActiveAvatarBottom] = useState<boolean>(true);
  const [selectedFileName, setSelectedFileName] =
    useState<string>("Choose a file...");
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [refresh, setRefresh] = useState<number>(0);
  const [refreshImg, setRefreshImg] = useState<number>(0);
  const [avatarImg, setAvatarImg] = useState<any>();

  useEffect(() => {
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
  }, [refresh, uploadedFile]);

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
    if (activeAvatarBottom === true) return "ShowAvatarBottom";
    else return "HideAvatarBottom";
  }

  function showAvatarBottomInChange() {
    if (activeAvatarBottom === false) return "ShowAvatarBottomInChange";
    else return "HideAvatarBottomInChange";
  }

  return (
    <div className="Avatar">
      <h3>Avatar</h3>
      <div className={showAvatarBottom()}>
        <Avatar user={props.user} />
        <button onClick={() => setActiveAvatarBottom(!activeAvatarBottom)}>
          <span className="material-icons">edit</span>
        </button>
      </div>
      <div className={showAvatarBottomInChange()}>
        <div className="AvatarImg">
          <img src={avatarImg} />
        </div>
        <div className="AvatarBottomChange">
          <button className="buttonChooseFile" onClick={handleClick}>
            <span className="material-icons">backup</span>
            <p>{selectedFileName}</p>
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={changeAvatarImg}
            style={{ display: "none" }}
          />
          <div className="ButtonsValidation">
            <button className="ValidNewAvatar" onClick={validNewAvatar}>
              <span className="material-icons">done</span>
            </button>
            <button
              className="NoValidNewAvatar"
              onClick={noValidNewAvatar}
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarSettings;
