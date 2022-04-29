import React from "react";
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import classes from "./ChannelSettings.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannelUser } from "../../../../interface/channel-user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import Dropdown from "./Dropdown/Dropdown.module";
import Dropdown2 from "./Dropdown2/Dropdown2.module";
import Dropdown3 from "./Dropdown3/Dropdown3.module";
import { channel } from "diagnostics_channel";
import { Scope } from "../../../../interface/scope.enum";
import clsx from "clsx";
import api from "../../../../apis/api";

interface Props {
  user: IUser;
  channel: IChannel;
  channels: IChannel[];
  ws: any;
  setChannelChoose: any;
  setActiveChatMenu: any;
  showChatRight: any;
  setShowChatRight: any;
}

const ChannelSettings: React.FC<Props> = (props: any): JSX.Element => {
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
  //const [bannedUsers, setBannedUsers] = useState<IChannelUser[]>([]);

  useEffect(() => {
    setNewChallengeMode(initChangeChannelMode());
    setRefreshDropdown(refreshDropdown + 1);
  }, [props.channel, props.channels]);

  /*useEffect(() => {
    props.ws.socket.on("bannedUsers", (data: IChannelUser[]) => {
      setBannedUsers(data);
      console.log("bannedUserssss:", bannedUsers);
    });

    props.ws.socket.emit("getBannedUsers", props.channel);
  }, []);*/

  function ifShowAdminSettings() {
    let i = 0;

    while (
      props.channel.users[i] &&
      props.channel.users[i].user &&
      props.channel.users[i].user.username != props.user.username
    ) {
      i++;
    }

    if (
      props.channel.users[i] &&
      props.channel.users[i].user &&
      props.channel.users[i].administrator == true
    )
      return classes.ShowAdminSettings;
    else return classes.HideAdminSettings;
  }

  function ifShowCreatorSettings() {
    let i = 0;
    while (
      props.channel.users[i] &&
      props.channel.users[i].user &&
      props.channel.users[i].user.username != props.user.username
    ) {
      i++;
    }
    if (
      props.channel.users[i] &&
      props.channel.users[i].user &&
      props.channel.users[i].creator == true
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
    let time = setBanTime();
    userToBan = findUser(banUser);

    if (userToBan != null) {
      if (userToBan?.username !== props.user.username)
      {
        if (banUserDuration!=="Unlimited")
        toast.success(userToBan.username + " is ban during " + banUserDuration);
        else 
        toast.success(userToBan.username + " is ban");
      }
      props.ws.socket.emit("banUser", {
        channel: props.channel,
        user: userToBan,
        milliseconds: time,
      });
    } else {
      toast.error("Ban : User not found")
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
    api
      .get(`/users/username/${unbanUser}`)
      .then((response) => {
        props.ws.socket.emit("unbanUser", {
          channel: props.channel,
          user: response.data,
        });
        //toast.success(response.data.username + " is unban")
      })
      .catch(() => toast.error("Unban : User not found"));
    setUnbanUser("");
    event.preventDefault();
  }

  function handleChangeUnban(event: any) {
    var value = event.target.value;
    setUnbanUser(value);
  }

  function setBanTime() {
    if (banUserDuration === "1 day") {
      return 86400000;
    } else if (banUserDuration === "1 week") {
      return 604800000;
    } else if (banUserDuration === "Unlimited") {
      return 999999999999999;
    }
    return 0;
  }

  //Mute User

  function findUser(username: string) {
    let i = 0;
    while (props.channel.users[i]) {
      if (props.channel.users[i].user.username == username)
        return props.channel.users[i].user;
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
    if (userToMute?.username !== props.user.username)
    toast.success(userToMute.username+ " is mute during "+ muteUserDuration);
      props.ws.socket.emit("muteUser", {
        channel: props.channel,
        user: userToMute,
        milliseconds: time,
      });
    } else {
      toast.error("Mute : User not found");
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
      toast.success(userToUnmute.username + " is unmute");
      props.ws.socket.emit("unmuteUser", {
        channel: props.channel,
        user: userToUnmute,
      });
    } else {
      toast.error("Unmute : User not found");
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
      props.ws.socket.emit("addAdministrator", {
        channel: props.channel,
        user: userToPromoteAdmin,
      });
      toast.success(userToPromoteAdmin.username + " is now admin");
    } else {
      toast.error("Admin : User not found");
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
    if (props.channel.state === 0) return "Public";
    if (props.channel.state === 1) return "Private";
    if (props.channel.state === 2) return "Protected";
  }

  function showChangeChannelMode() {
    let state: string = "";
    if (props.channel.state === 0) state = "Public";
    if (props.channel.state === 1) state = "Private";
    if (props.channel.state === 2) state = "Protected";
    if (state !== newChallengeMode) {
      return classes.ChangeChannelMode;
    }
    return classes.HideChangeChannelMode;
  }

  function showSetPassword(classname: string) {
    if (
      props.channel.state !== Scope.protected &&
      newChallengeMode === "Protected"
    ) {
      if (classname === "SetPassword") {
        return classes.SetPassword;
      } else if (classname === "ConfirmSetPassword") {
        return classes.ConfirmSetPassword;
      }
    }
    return classes.HideSetPassword;
  }

  function ajustMarginTopChangeChannelMode() {
    if (
      props.channel.state !== Scope.protected &&
      newChallengeMode === "Protected"
    ) {
      return classes.MarginZero;
    }
    return classes.MarginSevenHalf;
  }

  //Set Password
  function handleSubmitFormSetPassword(event: any) {
    if (newChallengeMode === "Public") {
      props.ws.socket.emit("changeChannelState", {
        id: props.channel.id,
        state: 0,
      });
      toast.success("Channel is now public")
    } else if (newChallengeMode === "Private") {
      props.ws.socket.emit("changeChannelState", {
        id: props.channel.id,
        state: 1,
      });
      toast.success("Channel is now private")
    } else if (newChallengeMode === "Protected") {
      if (setPassword != confirmSetPassword) {
        toast.error("Password and confirm password are different");
      } else {
        props.ws.socket.emit("changeChannelState", {
          id: props.channel.id,
          state: 2,
          password: setPassword,
        });
        toast.success("Channel is now protected")
      }
      setSetPassword("");
      setConfirmSetPassword("");
    }
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
    if (props.channel.state === Scope.protected) {
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
    if (newPassword != confirmNewPassword) {
      toast.error("Password and confirm password are different");
    } else {
      props.ws.socket.emit("changeChannelState", {
        id: props.channel.id,
        state: 2,
        password: newPassword,
      });
      toast.success("Password succesfully change !");
    }
    setNewPassword("");
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
      <button
        className={classes.CloseChatRightButton}
        onClick={() => {
          props.setShowChatRight(!props.showChatRight);
        }}
      >
        <span className="material-icons">close</span>
      </button>
      <div className={classes.ChannelUsers}>
        <h3>Users</h3>
        {props.channel.users.map((user: any) => (
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
          channelState={props.channel.state}
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
