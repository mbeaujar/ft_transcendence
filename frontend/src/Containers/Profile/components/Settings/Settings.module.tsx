import React, { useEffect, useState } from 'react';
import api from '../../../../apis/api';
import Avatar from '../Avatar/Avatar.module';
import classes from './Settings.module.scss';
import styles from './Profile.module.scss';
import { IUser } from '../../../../interface/user.interface';

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: any;
}

const Settings: React.FC<Props> = (props: Props): JSX.Element => {
  const [activeUsernameBottom, setActiveUsernameBottom] =
    useState<boolean>(true);
  const [newName, setNewName] = useState<string>(props.user?.username);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    props.user.username = newName;
    props.setRefresh(props.refresh + 1);
  }, [refresh]);

  function handleSubmitForm(event: any) {
    api
      .post('/users/username', { username: newName })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
    setActiveUsernameBottom(!activeUsernameBottom);
    event.preventDefault();
  }

  function handleChange(event: any) {
    var value = event.target.value;
    setNewName(value);
  }

  function showUsernameBottom() {
    if (activeUsernameBottom == true) return classes.ShowUsernameBottom;
    else return classes.HideUsernameBottom;
  }

  function showUsernameBottomChange() {
    if (activeUsernameBottom == false) return classes.ShowUsernameBottomChange;
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
            <form onSubmit={(event) => handleSubmitForm(event)}>
              <input
                className={classes.NewName}
                type="text"
                value={newName}
                onChange={(event) => handleChange(event)}
              />
              <input className={classes.ValidNewName} type="submit" value="L" />
            </form>
          </div>
        </div>
        <div className={classes.Avatar}></div>
      </div>
      <div className={classes.UsersBlock}></div>
    </div>
  );
};

export default Settings;
