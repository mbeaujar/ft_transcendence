import React from "react";
import { useEffect } from "react";
import classes from "./Discussion.module.scss";
import { IUser } from "../../../../interface/user.interface";
import { IChannel } from "../../../../interface/channel.interface";
import { IMessage } from "../../../../interface/message.interface";
import Avatar from "../../../Profile/components/Avatar/Avatar";

import styles from "./Discussion.module.scss";
import Input from "./Input";

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

  useEffect(() => {
    messageBody = document.querySelector("#msg");
    if (messageBody) {
      messageBody.scrollTop = messageBody.scrollHeight;
    }
  }, [props.messages]);

  const renderedMessages = props.messages.map((message: any) => {
    return (
      <div key={message.id} className={classes.Message}>
        <Avatar user={message.user} />
        <div className={classes.MessageRight}>
          <h4>{message.user.username}</h4>
          <p> {message.text}</p>
        </div>
      </div>
    );
  });

  return (
    <div className={classes.Discussion}>
      <h1>{props.channel.state!==3?props.channel.name:props.channel.users[0]?.user?.id === props.user.id
            ? `${props.channel.users[1]?.user?.username}`
            : `${props.channel.users[0]?.user?.username}`}</h1>
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
