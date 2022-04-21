import React from "react";
import { useState, useEffect, useRef } from "react";
import classes from "./ChannelSettings.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import Dropdown from "./Dropdown/Dropdown.module";
import Dropdown2 from "./Dropdown2/Dropdown2.module";
import Dropdown3 from "./Dropdown3/Dropdown3.module";
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
  const [banUserDuration, setBanUserDuration] = useState("1 day");
  const [unbanUser, setUnbanUser] = useState<string>("");
  const [muteUser, setMuteUser] = useState<string>("");
  const [muteUserDuration, setMuteUserDuration] = useState("1 minute");
  const [unmuteUser, setUnmuteUser] = useState<string>("");
  const [newAdmin, setNewAdmin] = useState<string>("");
  const [refreshDropdown, setRefreshDropdown] = useState<number>(0);
  const [newChallengeMode, setNewChallengeMode] = useState<string>();
  const [setPassword, setSetPassword] = useState<string>("");
  const [confirmSetPassword, setConfirmSetPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  useEffect(() => {
    actualChannel = ftGetActualChannel();
    setNewChallengeMode(initChangeChannelMode());
    setRefreshDropdown(refreshDropdown + 1);
    console.log("channel=",props.channel);
    console.log("channels=",props.channels);
  }, [props.channel]);

  useEffect(() => {
    console.log("ban=", banUserDuration);
  }, [banUserDuration]);

  useEffect(() => {
    console.log("mute=", muteUserDuration);
  }, [muteUserDuration]);

  useEffect(() => {
    console.log("mode=", newChallengeMode);
  }, [newChallengeMode]);

  function ftGetActualChannel() {
    //return (props.channel);
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

  const itemsBanDuration = [
    { id: 1, value: "1 day" },
    { id: 2, value: "1 week" },
    { id: 3, value: "Unlimited" },
  ];

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
    let userToBan: IUser | null = null;
    //let time = setMuteTime();
    userToBan = findUser(banUser);
    if (userToBan != null) {
      //console.log(userToBan.username," is ban during ",muteUserDuration);
      props.ws.socket.emit("banUser", {
        channel: actualChannel,
        user: userToBan,
        milliseconds: 100000,
      });
    } else {
      console.log("Ban : User not found");
    }
    setBanUser("");
    event.preventDefault();
  }

  function handleChangeBan(event: any) {
    var value = event.target.value;
    setBanUser(value);
  }

  //Unban User
  function handleSubmitFormUnban(event: any) {
    let userToUnban: IUser | null = null;
    userToUnban = findUser(unbanUser);
    if (userToUnban != null) {
      console.log(userToUnban.username, " is unban");
      props.ws.socket.emit("unmuteUser", {
        channel: actualChannel,
        user: userToUnban,
      });
    } else {
      console.log("Unban : User not found");
    }
    setUnbanUser("");
    event.preventDefault();
  }

  function handleChangeUnban(event: any) {
    var value = event.target.value;
    setUnbanUser(value);
  }

  //Mute User

  function findUser(username: string) {
    let i = 0;
    while (actualChannel.users[i]) {
      if (actualChannel.users[i].user.username == username)
        return actualChannel.users[i].user;
      i++;
    }
    return null;
  }

  function setMuteTime() {
    if (muteUserDuration == "1 minute") {
      return 60000;
    }
    if (muteUserDuration == "1 hour") {
      return 3600000;
    }
    if (muteUserDuration == "1 day") {
      return 86400000;
    }
  }

  function handleSubmitFormMute(event: any) {
    let userToMute: IUser | null = null;
    let time = setMuteTime();
    userToMute = findUser(muteUser);
    if (userToMute != null) {
      console.log(userToMute.username, " is mute during ", muteUserDuration);
      props.ws.socket.emit("muteUser", {
        channel: actualChannel,
        user: userToMute,
        milliseconds: time,
      });
    } else {
      console.log("Mute : User not found");
    }
    setMuteUser("");
    event.preventDefault();
  }

  function handleChangeMute(event: any) {
    var value = event.target.value;
    setMuteUser(value);
  }

  //Unmute User
  function handleSubmitFormUnmute(event: any) {
    let userToUnmute: IUser | null = null;
    userToUnmute = findUser(unmuteUser);
    if (userToUnmute != null) {
      console.log(userToUnmute.username, " is unmute");
      props.ws.socket.emit("unmuteUser", {
        channel: actualChannel,
        user: userToUnmute,
      });
    } else {
      console.log("Unmute : User not found");
    }
    setUnmuteUser("");
    event.preventDefault();
  }

  function handleChangeUnmute(event: any) {
    var value = event.target.value;
    setUnmuteUser(value);
  }

  //New admin
  function handleSubmitFormNewAdmin(event: any) {
    let userToPromoteAdmin: IUser | null = null;
    userToPromoteAdmin = findUser(newAdmin);
    if (userToPromoteAdmin != null) {
      console.log(userToPromoteAdmin.username, " is admin");
      props.ws.socket.emit("addAdministrator", {
        channel: actualChannel,
        user: userToPromoteAdmin,
      });
    } else {
      console.log("Admin : User not found");
    }
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
    if (
      actualChannel.state !== Scope.protected &&
      newChallengeMode === "Protected"
    ) {
      if (classname == "SetPassword") {
        return classes.SetPassword;
      } else if (classname == "ConfirmSetPassword") {
        return classes.ConfirmSetPassword;
      }
    }
    return classes.HideSetPassword;
  }

  function ajustMarginTopChangeChannelMode() {
    if (
      actualChannel.state !== Scope.protected &&
      newChallengeMode === "Protected"
    ) {
      return classes.MarginZero;
    }
    return classes.MarginSevenHalf;
  }
  //Set Password
  function handleSubmitFormSetPassword(event: any) {
    console.log("setpassword=", setPassword);
    setSetPassword("");
    console.log("confirmsetpassword=", confirmSetPassword);
    setConfirmSetPassword("");
    event.preventDefault();
  }

  function handleChangeSetPassword(event: any) {
    var value = event.target.value;
    setSetPassword(value);
  }

  function handleChangeConfirmSetPassword(event: any) {
    var value = event.target.value;
    setConfirmSetPassword(value);
  }

  //New password
  function showNewPassword(classname: string) {
    if (actualChannel.state === Scope.protected) {
      if (classname == "NewPassword") {
        return classes.NewPassword;
      } else if (classname == "ConfirmNewPassword") {
        return classes.ConfirmNewPassword;
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

  function handleSubmitFormNewPassword(event: any) {
    console.log("newpassword=", newPassword);
    setNewPassword("");
    console.log("confirmnewpassword=", confirmNewPassword);
    setConfirmNewPassword("");
    event.preventDefault();
  }

  function handleChangeNewPassword(event: any) {
    var value = event.target.value;
    setNewPassword(value);
  }

  function handleChangeConfirmNewPassword(event: any) {
    var value = event.target.value;
    setConfirmNewPassword(value);
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
      <button onClick={() => console.log(actualChannel)}>Print channel</button>

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
        <Dropdown3
          title="Ban Duration"
          items={itemsBanDuration}
          setBanUserDuration={setBanUserDuration}
        />
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
          <input
            className={classes.SetPasswordInput}
            type="text"
            value={setPassword}
            onChange={(event) => handleChangeSetPassword(event)}
          ></input>
        </div>
        <div className={showSetPassword("ConfirmSetPassword")}>
          <p>Confirm</p>
          <input
            className={classes.ConfirmSetPasswordInput}
            type="text"
            value={confirmSetPassword}
            onChange={(event) => handleChangeConfirmSetPassword(event)}
          ></input>
        </div>
        <button
          className={clsx(
            showChangeChannelMode(),
            ajustMarginTopChangeChannelMode()
          )}
          onClick={handleSubmitFormSetPassword}
        >
          Change channel mode
        </button>
        <div
          className={clsx(
            showNewPassword("NewPassword"),
            ajustMarginTopChangePassword()
          )}
        >
          <p>New password</p>
          <input
            className={classes.NewPasswordInput}
            type="text"
            value={newPassword}
            onChange={(event) => handleChangeNewPassword(event)}
          ></input>
        </div>
        <div className={showNewPassword("ConfirmNewPassword")}>
          <p>Confirm</p>
          <input
            className={classes.ConfirmNewPasswordInput}
            type="text"
            value={confirmNewPassword}
            onChange={(event) => handleChangeConfirmNewPassword(event)}
          ></input>
        </div>
        <button
          className={showNewPassword("ChangePassword")}
          onClick={handleSubmitFormNewPassword}
        >
          Change password
        </button>
      </div>
    </div>
  );
};

export default ChannelSettings;
