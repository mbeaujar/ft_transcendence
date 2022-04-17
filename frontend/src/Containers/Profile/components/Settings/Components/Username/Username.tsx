import React, { useState, useEffect } from "react";
import api from "../../../../../../apis/api";
import "./Username.scss";

function Username(props: any) {
  const [activeUsernameBottom, setActiveUsernameBottom] =
    useState<boolean>(true);
    const [newName, setNewName] = useState<string>(props.user?.username);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(()=>{
      props.setRefresh(props.refresh + 1);
      props.user.username = newName;
    },[refresh]);

  function handleSubmitFormUsername(event: any) {
    api
      .post("/users/username", { username: newName })
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
    if (activeUsernameBottom === true) return "ShowUsernameBottom";
    else return "HideUsernameBottom";
  }

  function showUsernameBottomChange() {
    if (activeUsernameBottom === false) return "ShowUsernameBottomChange";
    else return "HideUsernameBottomChange";
  }
  return (
    <div className="Username">
      <h3>Username</h3>
      <div className={showUsernameBottom()}>
        <p>{newName}</p>
        <button onClick={() => setActiveUsernameBottom(!activeUsernameBottom)}>
          <span className="material-icons">edit</span>
        </button>
      </div>
      <div className={showUsernameBottomChange()}>
        <form onSubmit={(event) => handleSubmitFormUsername(event)}>
          <input
            className="NewName"
            type="text"
            value={newName}
            onChange={(event) => handleChangeUsername(event)}
          />
          <button className="ValidNewName" type="submit">
            <span className="material-icons">done</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Username;
