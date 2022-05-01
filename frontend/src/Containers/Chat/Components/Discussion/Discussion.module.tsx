import React, { useState } from "react";
import { useEffect } from "react";
import classes from "./Discussion.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import { IMessage } from "../../../../interface/message.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";

import styles from "./Discussion.module.scss";
import Input from "./Input";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "menu-id";

interface Props {
  user: IUser;
  channel: IChannel;
  ws: any;
  messages: any;
  showChatRight: any;
  setShowChatRight: any;
}

const Discussion: React.FC<Props> = (props: Props): JSX.Element => {
  var messageBody = document.querySelector("#msg");
  const [userActif, setUserActif] = useState<IUser>();

  useEffect(() => {
    messageBody = document.querySelector("#msg");
    if (messageBody) {
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }, [props.messages]);

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function handleItemClick(
    event: any,
    props: any,
    triggerEvent: any,
    data: any
  ) {
    console.log(event, props, triggerEvent, data);
    console.log("okkkkk");
  }

  function RightClickProfile() {
    console.log("RightClickProfile:", userActif);
    let path = "/OtherUserProfile/" + userActif?.username;
    window.location.href = path;
  }

  function RightClickBlock() {
    console.log("RightClickBlock", userActif);
  }

  function RightClickInviteToPlay() {
    console.log("RightClickInviteToPlay", userActif);
  }

  function displayMenu(e: any, userToVisit: IUser) {
    console.log("usermenu=", userToVisit.username);
    setUserActif(userToVisit);
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    if (userToVisit.username != props.user.username) show(e);
  }

  const renderedMessages = props.messages.map((message: any, index: number) => {
    let userClick: IUser = message.user;
    console.log("userclick=", props.messages);
    return (
      <div key={message.id} className={classes.Message}>
        <Avatar user={message.user} />
        <div className={classes.MessageRight}>
          <h4 onContextMenu={(e) => displayMenu(e, message.user)}>
            {message.user.username}
          </h4>
          <p> {message.text}</p>
          <Menu id={MENU_ID} theme="dark">
            <Item
              onClick={() => {
                RightClickProfile();
              }}
            >
              See profile
            </Item>
            <Item onClick={() => RightClickBlock()}>Block this user</Item>
            <Item onClick={() => RightClickInviteToPlay()}>Invite to play</Item>
          </Menu>
        </div>
      </div>
    );
  });

  return (
    <div className={classes.Discussion}>
      <h1>
        {props.channel.state !== 3
          ? props.channel.name
          : props.channel.users[0]?.user?.id === props.user.id
          ? `${props.channel.users[1]?.user?.username}`
          : `${props.channel.users[0]?.user?.username}`}
      </h1>
      <button
        className={classes.OpenChannelSettings}
        onClick={() => props.setShowChatRight(!props.showChatRight)}
      >
        <span className="material-icons">settings</span>
      </button>
      <div className={classes.Messages} id="msg">
        {renderedMessages}
      </div>
      <div className={classes.InputDiv}>
        <Input
          onSubmit={(text: string) => {
            const message: IMessage = {
              text,
              user: props.user,
            };
            if (props.channel !== null) {
              Object.assign(message, { channel: props.channel });
            }
            props.ws.socket.emit("addMessage", message);
          }}
        />
      </div>
    </div>
  );
};

export default Discussion;
