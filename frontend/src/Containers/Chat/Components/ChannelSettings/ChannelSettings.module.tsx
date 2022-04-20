import React from "react";
import { useState, useEffect, useRef } from "react";
import classes from "./ChannelSettings.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import Dropdown from "./Dropdown/Dropdown.module";
import Dropdown2 from "./Dropdown2/Dropdown2.module";
import { channel } from "diagnostics_channel";
import { Scope } from "../../../../interface/scope.enum";
import clsx from "clsx";

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
  const [refreshDropdown, setRefreshDropdown] = useState<number>(0);
  const [newChallengeMode, setNewChallengeMode] = useState<string>();

  useEffect(() => {
    actualChannel = ftGetActualChannel();
    setNewChallengeMode(initChangeChannelMode());
    setRefreshDropdown(refreshDropdown + 1);
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

  //Change channel mode
  function initChangeChannelMode() {
    if (actualChannel.state == 0) return "Public";
    if (actualChannel.state == 1) return "Private";
    if (actualChannel.state == 2) return "Protected";
  }

  function showChangeChannelMode() {
    let state: string = "";
    if (actualChannel.state == 0) state = "Public";
    if (actualChannel.state == 1) state = "Private";
    if (actualChannel.state == 2) state = "Protected";
    if (state !== newChallengeMode) {
      return classes.ChangeChannelMode;
    }
    return classes.HideChangeChannelMode;
  }

  function showSetPassword(classname: string) {
    if (actualChannel.state !== Scope.protected && newChallengeMode==="Protected") {
      if (classname == "SetPassword") {
        return classes.SetPassword;
      } else if (classname == "ConfirmSetPassword") {
        return classes.ConfirmSetPassword;
      }
    }
    return classes.HideSetPassword;
  }

  function ajustMarginTopChangeChannelMode() {
    if (actualChannel.state !== Scope.protected && newChallengeMode==="Protected") {
      return classes.MarginZero;
    }
    return classes.MarginSevenHalf;
  }
  
  //New password
  function showNewPassword(classname: string) {
    if (actualChannel.state === Scope.protected) {
      if (classname == "NewPassword") {
        return classes.NewPassword;
      } else if (classname == "ConfirmPassword") {
        return classes.ConfirmPassword;
      } else if (classname == "ActualPassword") {
        return classes.ActualPassword;
      } else if (classname == "ChangePassword") {
        return classes.ChangePassword;
      }
    }
    return classes.HideChangePasswordSettings;
  }
  
  function ajustMarginTopChangePassword() {
    if (showChangeChannelMode() == classes.ChangeChannelMode) {
      return classes.MarginZero;
    }
    return classes.MarginSevenHalf;
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
        <Dropdown2
          title="Channel Mode"
          items={itemsChannelMode}
          refreshDropdown={refreshDropdown}
          channelState={actualChannel.state}
          setNewChallengeMode={setNewChallengeMode}
        />
        <div className={showSetPassword("SetPassword")}>
          <p>Set password</p>
          <input className={classes.SetPasswordInput}></input>
        </div>
        <div className={showSetPassword("ConfirmSetPassword")}>
          <p>Confirm</p>
          <input className={classes.ConfirmSetPasswordInput}></input>
        </div>
        <button className={clsx(showChangeChannelMode(),ajustMarginTopChangeChannelMode())}>Change channel mode</button>
        <div
          className={clsx(
            showNewPassword("NewPassword"),
            ajustMarginTopChangePassword()
          )}
        >
          <p>New password</p>
          <input className={classes.NewPasswordInput}></input>
        </div>
        <div className={showNewPassword("ConfirmPassword")}>
          <p>Confirm</p>
          <input className={classes.ConfirmInput}></input>
        </div>
        <div className={showNewPassword("ActualPassword")}>
          <p>Actual password</p>
          <input className={classes.ActualPasswordInput}></input>
        </div>
        <button className={showNewPassword("ChangePassword")}>
          Change password
        </button>
      </div>
    </div>
  );
};

export default ChannelSettings;
