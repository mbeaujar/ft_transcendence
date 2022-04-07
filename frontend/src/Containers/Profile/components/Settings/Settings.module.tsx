import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar.module';
import classes from './Settings.module.scss';
import styles from './Profile.module.scss';
import { IUser } from '../../../../interface/user.interface';
import styled from 'styled-components';

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: any;
}

const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;

const Settings: React.FC<Props> = (props: Props): JSX.Element => {
  const [activeUsernameBottom, setActiveUsernameBottom] =
    useState<boolean>(true);
  const [newName, setNewName] = useState<string>(props.user?.username);
  const [selectedFileName, setSelectedFileName] =
    useState<string>('Upload a file');
  //const [selectedFile, setSelectedFile] = useState<any>();
  const [refresh, setRefresh] = useState<number>(0);

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleClick = (event: any) => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };
  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    setSelectedFileName(event.target.files[0].name);
    console.log("selectedFile:"+fileUploaded+" selectedFile"+selectedFileName);
    /*const formData = new FormData();
    formData.append('file', event.target.files[0], event.target.files[0].name);
    console.log('file', event.target.files[0]);
    api
      .post('/local-files/avatar', formData)
      .then((response) => console.log(response.data))
      .catch((reject) => console.log(reject));*/
  };

  useEffect(() => {
    props.user.username = newName;
    props.setRefresh(props.refresh + 1);
  }, [refresh]);

  function handleSubmitFormUsername(event: any) {
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

  function handleSubmitFormAvatar(event: any) {
    /*api
      .post('/users/username', { username: newName })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
    setActiveUsernameBottom(!activeUsernameBottom);
    event.preventDefault();*/
  }

  function showUsernameBottom() {
    if (activeUsernameBottom === true) return classes.ShowUsernameBottom;
    else return classes.HideUsernameBottom;
  }

  function showUsernameBottomChange() {
    if (activeUsernameBottom === false) return classes.ShowUsernameBottomChange;
    else return classes.HideUsernameBottomChange;
  }

  return (
    <div className={classes.Settings}>
      <div className={classes.SettingsLeft}>
        <div className={classes.DoubleAuth}></div>
        <div className={classes.Username}>
          <h3>Username</h3>
          <div className={showUsernameBottom()}>
            <p>{newName}</p>
            <button
              onClick={() => setActiveUsernameBottom(!activeUsernameBottom)}
            >
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div className={showUsernameBottomChange()}>
            <form onSubmit={(event) => handleSubmitFormUsername(event)}>
              <input
                className={classes.NewName}
                type="text"
                value={newName}
                onChange={(event) => handleChangeUsername(event)}
              />
              <button className={classes.ValidNewName} type="submit">
                <span className="material-icons">done</span>
              </button>
            </form>
          </div>
        </div>
        <div className={classes.Avatar}>
          <h3>Avatar</h3>
          <div className={classes.AvatarBottom}>
            <Avatar user={props.user} />
            <div className={classes.AvatarBottomChange}>
              <button onClick={handleClick}>{selectedFileName}</button>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.UsersBlock}></div>
    </div>
  );
};

export default Settings;
