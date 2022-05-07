import React, { useState } from "react";
import { useEffect } from "react";
import classes from "./Discussion.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import { IMessage } from "../../../../interface/message.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";
import { BrowserRouter as Router, Link } from "react-router-dom";
import styles from "./Discussion.module.scss";
import { toast } from "react-toastify";
import Input from "./Input";
import styled from "styled-components";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import clsx from "clsx";
import api from "../../../../apis/api";

const MENU_ID = "menu-id";

interface Props {
  user: IUser;
  channel: IChannel;
  ws: any;
  messages: IMessage[];
  showChatRight: boolean;
  setShowChatRight: (value:boolean)=>void;
}

const Discussion: React.FC<Props> = (props: Props): JSX.Element => {
  var messageBody = document.querySelector("#msg");
  const [messageUser, setMessageUser] = useState<IUser>();

  useEffect(() => {
    console.log("uuuuu=", props.user);
    messageBody = document.querySelector("#msg");
    if (messageBody) {
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }, [props.messages]);

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function RightClickBlock() {
    console.log("RightClickBlock", messageUser);
    let userToBlock: IUser;
    api
      .get(`/users/username/${messageUser?.username}`)
      .then((response) => {
        userToBlock = response.data;
        api
          .post("/users/block", { id: userToBlock.id })
          .then((response) => {
            props.user.blockedUsers.map((userBlock: IUser) => {
              if (userBlock.username === userToBlock.username) {
                toast.error(messageUser?.username + " was already blocked");
                return;
              }
            });
            toast.success(userToBlock.username + " was blocked");
          })
          .catch((reject) => console.error(reject));
      })
      .catch(() => {
        toast.error("User not find");
      });
  }

  function RightClickInviteToPlay() {
    console.log("RightClickInviteToPlay", messageUser);
  }

  function displayMenu(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>, userToVisit: IUser) {
    setMessageUser(userToVisit);
    if (userToVisit.username != props.user.username) show(e);
  }

  const renderedMessages = props.messages.map((message: IMessage, index: number) => {
    return (
      <div key={message.id} className={classes.Message}>
        <Avatar user={message.user} />
        <div className={classes.MessageRight}>
          <h4 onContextMenu={(e) => displayMenu(e, message.user)}>
            {message.user.username}
          </h4>
          <p> {message.text}</p>
          <Menu id={MENU_ID} theme="dark">
            <Item>
              <Link
                className={classes.Link}
                to={"/profile/" + messageUser?.username}
              >
                See profile
              </Link>
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
        className={clsx(
          classes.OpenChannelSettings,
          props.channel.name === "DM" ? classes.HideOpenChannelSettings : null
        )}
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
