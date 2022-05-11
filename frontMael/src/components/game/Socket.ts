import Cookies from "js-cookie";
import socketIOClient from 'socket.io-client'

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: Cookies.get("access_token"),
      },
    },
  },
};

function getSocket(url: string) {
	return socketIOClient(`http://localhost:3000/${url}`, socketOptions);
}

export default getSocket;