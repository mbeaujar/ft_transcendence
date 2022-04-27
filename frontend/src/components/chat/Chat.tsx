import React, { useEffect, useState } from 'react';
import Input from './Input';
import { WebSocket } from './Socket';
import { IUser } from '../interface/user.interface';
import { IChannel } from '../interface/channel.interface';
import { IMessage } from '../interface/message.interface';
import CreateChannel from './CreateChannel';
import { Scope } from '../interface/scope.enum';
import { IJoinChannel } from '../interface/join-channel.interface';
import './Chat.css';
import api from '../../apis/api';
import { Link } from 'react-router-dom';

const ws = new WebSocket('http://localhost:3000/chat');
ws.disconnect();

interface Props {
  user: IUser;
  refresh: any;
  setRefresh: any;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [channelChoose, setChannelChoose] = useState<IChannel | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userid, setUserid] = useState<string>('');
  const [user, setUser] = useState<IUser>();

  /** Listen event from backend socket */
  useEffect(() => {
    ws.connect();
    ws.socket.on('channels', data => {
      console.log('channels', data);
      setChannels(data);
    });

    ws.socket.on('messages', data => {
      setMessages(data);
    });

    ws.socket.on('Error', data => {
      console.log(data);
    });

    ws.socket.on('messageAdded', data => {
      setMessages(prev => [...prev, data]);
    });
    ws.socket.on('currentChannel', data => {
      console.log('currentChannel', data);
      setChannelChoose(data);
    });

    // ws.socket.emit('getAllChannels');
    return () => {
      ws.disconnect();
      // ws?.socket.on('disconnect', () => {});
    };
  }, []);

  const renderedChannels = channels.map(channel => {
    return (
      <div key={channel.id}>
        <button
          onClick={() => {
            const joinChannel: IJoinChannel = {
              channel,
            };
            if (channel.state === Scope.protected) {
              Object.assign(joinChannel, { password: prompt('password') });
            }

            ws.socket.emit('joinChannel', joinChannel);
          }}
        >
          {channel.name}
        </button>
      </div>
    );
  });

  const renderedMessages = messages.map(message => {
    const isUserMessage =
      message.user.id === props.user.id ? 'message-right' : 'message-left';
    return (
      <div key={message.id} className={`message ${isUserMessage}`}>
        <p style={{ marginLeft: 10 }}>
          {message.user.username}
          <br />
          {message.text}
        </p>
      </div>
    );
  });
  const [invites, setInvites] = useState<any>([]);

  return (
    <div>
      <button
        onClick={() => {
          api
            .get(`/users/${74728}`)
            .then(response =>
              ws.socket.emit('createDiscussion', {
                channel: {
                  state: 3,
                  name: 'arm',
                  password: '',
                  users: [],
                },
                user: response.data,
              })
            )
            .catch(reject => console.error(reject));
        }}
      >
        create discussion
      </button>
      <button
        onClick={() => {
          ws.socket.emit('changeChannelState', {
            id: channelChoose?.id,
            state: 2,
            password: 'Mael',
          });
        }}
      >
        changeChannelState
      </button>
      <Link
        to="/game"
        onClick={() => {
          api
            .post('/game/invite', { target: 74632 })
            .then(response => console.log(response.data))
            .catch(reject => console.error(reject));
        }}
      >
        invite ramzi to play
      </Link>
      <button
        onClick={() => {
          api
            .get('/game/invite')
            .then(response => {
              console.log('invites', response.data);
              setInvites(response.data);
            })
            .catch(reject => console.error(reject));
        }}
      >
        get invite (click before accept)
      </button>
      <button
        onClick={() => {
          api
            .post('/game/accept', { target: parseInt(invites[0].id) })
            .then(response => console.log(response.data))
            .catch(reject => console.error(reject));
        }}
      >
        ramzi accept to play
      </button>
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          ws.socket.emit('getAllChannels');
        }}
      >
        all channels
      </button>
      <button
        onClick={() => {
          api
            .post('/users/block', { id: 74632 })
            .then(response => console.log(response.data))
            .catch(reject => console.error(reject));
        }}
      >
        block mael
      </button>
      <button
        onClick={() => {
          api
            .post('/users/unblock', { id: 74632 })
            .then(response => console.log(response.data))
            .catch(reject => console.error(reject));
        }}
      >
        unblock mael
      </button>
      <button
        onClick={() => {
          ws.socket.emit('leaveChannel', channelChoose);
          setChannelChoose(null);
        }}
      >
        leave channel
      </button>
      <CreateChannel
        user={props.user}
        socketEmit={(channel: IChannel) => {
          ws.socket.emit('createChannel', channel);
        }}
      />
      <button
        onClick={() => {
          api
            .get('/users/74632')
            .then(response => {
              ws.socket.emit('addAdministrator', {
                channel: channelChoose,
                user: response.data,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        add mael administrator
      </button>
      <button
        onClick={() => {
          api
            .get('/users/74632')
            .then(response => {
              ws.socket.emit('removeAdministrator', {
                channel: channelChoose,
                user: response.data,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        remove mael administrator
      </button>
      <button
        onClick={() => {
          api
            .get('/users/74632')
            .then(response => {
              ws.socket.emit('muteUser', {
                channel: channelChoose,
                user: response.data,
                milliseconds: 10000,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        mute mael
      </button>
      <button
        onClick={() => {
          api
            .get('/users/74632')
            .then(response => {
              ws.socket.emit('unmuteUser', {
                channel: channelChoose,
                user: response.data,
                milliseconds: 100000,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        unmute mael
      </button>
      <button
        onClick={() => {
          api
            .get('/users/74728')
            .then(response => {
              ws.socket.emit('banUser', {
                channel: channelChoose,
                user: response.data,
                milliseconds: 10000000000,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        ban ramzi
      </button>
      <button
        onClick={() => {
          api
            .get('/users/74728')
            .then(response => {
              ws.socket.emit('unbanUser', {
                channel: channelChoose,
                user: response.data,
                milliseconds: 100000,
              });
            })
            .catch(reject => console.error(reject));
        }}
      >
        unban ramzi
      </button>
      <br />
      <p>
        Current channel: {channelChoose?.name ? channelChoose.name : 'none'}
      </p>

      <button
        onClick={() => {
          api
            .get(`/users/${userid}`)
            .then(response => setUser(response.data))
            .catch(reject => console.log(reject));
        }}
      >
        fill user
      </button>

      <button
        onClick={() => {
          const channel = { name: 'blabla', state: 3, users: [], password: '' };

          ws.socket.emit('createDiscussion', {
            user,
            channel,
          });
        }}
      >
        CREATE DISCUSSION
      </button>
      <Input label="user id" onSubmit={(text: string) => setUserid(text)} />
      <Input
        label="send Message"
        onSubmit={(text: string) => {
          const message: IMessage = {
            text,
            user: props.user,
          };
          if (channelChoose !== null) {
            Object.assign(message, { channel: channelChoose });
          }
          ws.socket.emit('addMessage', message);
        }}
      />
      <div className="container">
        <div className="block-left">{renderedChannels}</div>
        <div className="block-right">{renderedMessages}</div>
      </div>
    </div>
  );
};

export default Chat;
