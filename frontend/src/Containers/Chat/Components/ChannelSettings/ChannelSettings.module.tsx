import React from "react";
import { useState, useEffect, useRef } from "react";
import classes from "./ChannelSettings.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import Dropdown from "./Dropdown/Dropdown.module";
import Dropdown2 from "./Dropdown2/Dropdown2.module";
import { channel } from "diagnostics_channel";

interface Props {
  user: IUser;
  channel: IChannel;
  channels: IChannel[];
  ws: any;
  setChannelChoose: any;
  setActiveChatMenu: any;
}

const ChannelSettings: React.FC<Props> = (props: Props): JSX.Element => {
  let actualChannel: any = ftGetActualChannel();
  const [leaveChannel, setLeaveChannel] = useState<boolean>(false);
  const [banUser, setBanUser] = useState<string>("");
  const [unbanUser, setUnbanUser] = useState<string>("");
  const [muteUser, setMuteUser] = useState<string>("");
  const [muteUserDuration, setMuteUserDuration] = useState("1 minute");
  const [unmuteUser, setUnmuteUser] = useState<string>("");
  const [newAdmin, setNewAdmin] = useState<string>("");

  useEffect(() => {
    actualChannel = ftGetActualChannel();
  }, [props.channel]);

  function ftGetActualChannel() {
    let i = 0;
    while (i < props.channels.length) {
      if (props.channels[i].name == props.channel.name) {
        return props.channels[i];
      }
      i++;
    }
  }

  function ifShowAdminSettings() {
    let i = 0;

    while (
      actualChannel.users[i] &&
      actualChannel.users[i].user &&
      actualChannel.users[i].user.username != props.user.username
    ) {
      i++;
    }

    if (
      actualChannel.users[i] &&
      actualChannel.users[i].user &&
      actualChannel.users[i].administrator == true
    )
      return classes.ShowAdminSettings;
    else return classes.HideAdminSettings;
  }

  function ifShowCreatorSettings() {
    let i = 0;
    while (
      actualChannel.users[i] &&
      actualChannel.users[i].user &&
      actualChannel.users[i].user.username != props.user.username
    ) {
      i++;
    }
    if (
      actualChannel.users[i] &&
      actualChannel.users[i].user &&
      actualChannel.users[i].creator == true
    )
      return classes.ShowCreatorSettings;
    else return classes.HideCreatorSettings;
  }

  const itemsMuteDuration = [
    { id: 1, value: "1 minute" },
    { id: 2, value: "1 hour" },
    { id: 3, value: "1 day" },
  ];

  const itemsChannelMode = [
    { id: 1, value: "Public" },
    { id: 2, value: "Private" },
    { id: 3, value: "Protected" },
  ];

  //Ban User
  function handleSubmitFormBan(event: any) {
    console.log("banUser=", banUser);
    setBanUser("");
    event.preventDefault();
  }

  function handleChangeBan(event: any) {
    var value = event.target.value;
    setBanUser(value);
  }

  //Unban User
  function handleSubmitFormUnban(event: any) {
    console.log("unban=", unbanUser);
    setUnbanUser("");
    event.preventDefault();
  }

  function handleChangeUnban(event: any) {
    var value = event.target.value;
    setUnbanUser(value);
  }

  //Mute User
  function handleSubmitFormMute(event: any) {
    console.log("muteUser=", muteUser);
    setMuteUser("");
    event.preventDefault();
  }

  function handleChangeMute(event: any) {
    var value = event.target.value;
    setMuteUser(value);
  }

  //Unmute User
  function handleSubmitFormUnmute(event: any) {
    console.log("unmuteUser=", unmuteUser);
    setUnmuteUser("");
    event.preventDefault();
  }

  function handleChangeUnmute(event: any) {
    var value = event.target.value;
    setUnmuteUser(value);
  }

  //New admin
  function handleSubmitFormNewAdmin(event: any) {
    console.log("newAdmin=", newAdmin);
    setNewAdmin("");
    event.preventDefault();
  }

  function handleChangeNewAdmin(event: any) {
    var value = event.target.value;
    setNewAdmin(value);
  }

  return (
    <div className={classes.ChannelSettings}>
      <div className={classes.ChannelUsers}>
        <h3>Users</h3>
        {actualChannel.users.map((user: any) => (
          <div className={classes.ChannelUser} key={user.id}>
            <Avatar user={user.user} />
            <p>{user.user.username}</p>
          </div>
        ))}
      </div>

      <div className={classes.UserSettings}>
        <h3>User settings</h3>
        <button
          onClick={() => {
            props.setChannelChoose(null);
            setLeaveChannel(true);
            props.ws.socket.emit("leaveChannel", props.channel);
            props.setActiveChatMenu(null);
          }}
        >
          Leave channel
        </button>
      </div>

      <div
        className={
          !leaveChannel ? ifShowAdminSettings() : classes.HideAdminSettings
        }
      >
        <h3>Admin settings</h3>
        <form
          className={classes.BanUser}
          onSubmit={(event) => handleSubmitFormBan(event)}
        >
          <p>Ban User</p>
          <input
            className={classes.BanUserInput}
            type="text"
            value={banUser}
            onChange={(event) => handleChangeBan(event)}
          ></input>
        </form>
        <form
          className={classes.UnbanUser}
          onSubmit={(event) => handleSubmitFormUnban(event)}
        >
          <p>Unban User</p>
          <input
            className={classes.UnbanUserInput}
            type="text"
            value={unbanUser}
            onChange={(event) => handleChangeUnban(event)}
          ></input>
        </form>
        <form
          className={classes.MuteUser}
          onSubmit={(event) => handleSubmitFormMute(event)}
        >
          <p>Mute User</p>
          <input
            className={classes.MuteUserInput}
            type="text"
            value={muteUser}
            onChange={(event) => handleChangeMute(event)}
          ></input>
        </form>
        <Dropdown
          title="Mute Duration"
          items={itemsMuteDuration}
          setMuteUserDuration={setMuteUserDuration}
        />
        <form
          className={classes.UnmuteUser}
          onSubmit={(event) => handleSubmitFormUnmute(event)}
        >
          <p>Unmute User</p>
          <input
            className={classes.UnmuteUserInput}
            type="text"
            value={unmuteUser}
            onChange={(event) => handleChangeUnmute(event)}
          ></input>
        </form>
      </div>

      <div
        className={
          !leaveChannel ? ifShowCreatorSettings() : classes.HideCreatorSettings
        }
      >
        <h3>Creator settings</h3>
        <form
          className={classes.NewAdmin}
          onSubmit={(event) => handleSubmitFormNewAdmin(event)}
        >
          <p>New Admin</p>
          <input
            className={classes.NewAdminInput}
            type="text"
            value={newAdmin}
            onChange={(event) => handleChangeNewAdmin(event)}
          ></input>
        </form>
        <Dropdown2 title="Channel Mode" items={itemsChannelMode} />
        <div className={classes.ChangePassword}>
          <p>Change password</p>
          <input className={classes.ChangePasswordInput}></input>
        </div>
        <div className={classes.ConfirmPassword}>
          <p>Confirm</p>
          <input className={classes.ConfirmInput}></input>
        </div>
        <div className={classes.ActualPassword}>
          <p>Actual password</p>
          <input className={classes.ActualPasswordInput}></input>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettings;
