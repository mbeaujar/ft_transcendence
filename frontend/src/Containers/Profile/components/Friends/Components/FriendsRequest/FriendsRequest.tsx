import React, { useState, useEffect } from "react";
import api from "../../../../../../apis/api";
import "./FriendsRequest.scss";
import { IFriendsRequest } from "../../../../../../interface/friends-request.interface";
import Avatar from "../../../Avatar/Avatar";

function FriendsRequest(props: any) {
  const [refresh, setRefresh] = useState<number>(0);
  const [friendsRequest, setFriendsRequest] = useState<IFriendsRequest[]>([]);

  useEffect(() => {
    api
      .get("/friends/request")
      .then((response) => setFriendsRequest(response.data))
      .catch((reject) => console.error(reject));

    if (refresh > 0) props.setRefreshMyFriends(props.refreshMyFriends + 1);
    console.log("friendsrequest effect");
  }, [refresh]);

  const acceptRequest = (username: string) => {
    api
      .post("/friends/add", { username })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };

  const refuseRequest = (id: number) => {
    api
      .post("/friends/refuse", { id })
      .then((response) => setRefresh(refresh + 1))
      .catch((reject) => console.error(reject));
  };

  return (
    <div className="FriendsRequest">
      <h2>Friends Request</h2>
      {friendsRequest && (
        <div className="request">
          {friendsRequest.map((friendRequest: IFriendsRequest) => (
            <div className="friendsRequestsElement" key={friendRequest.user}>
              <Avatar user={friendRequest.userInfo} />
              <p>{friendRequest.userInfo?.username}</p>
              <button
                className="accept"
                onClick={() => acceptRequest(friendRequest.userInfo.username)}
              >
                Accept
              </button>
              <button
                className="refuse"
                onClick={() => refuseRequest(friendRequest.user)}
              >
                Refuse
              </button>
            </div>
          ))}
          <div className="friendsRequestsElement" >
            <div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
                }
              />
            </div>
            <p>Sommecaise</p>
            <button className="accept">Accept</button>
            <button className="refuse">Refuse</button>
          </div>
          <div className="friendsRequestsElement" >
            <div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
                }
              />
            </div>
            <p>Sommecaise</p>
            <button className="accept">Accept</button>
            <button className="refuse">Refuse</button>
          </div>
          <div className="friendsRequestsElement" >
            <div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
                }
              />
            </div>
            <p>Sommecaise</p>
            <button className="accept">Accept</button>
            <button className="refuse">Refuse</button>
          </div>
          <div className="friendsRequestsElement" >
            <div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
                }
              />
            </div>
            <p>Sommecaise</p>
            <button className="accept">Accept</button>
            <button className="refuse">Refuse</button>
          </div>
          <div className="friendsRequestsElement" >
            <div>
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSppkq9EOR9dtyDFm5mDlJ0-eJ2ddp8G9MSVw&usqp=CAU"
                }
              />
            </div>
            <p>Sommecaise</p>
            <button className="accept">Accept</button>
            <button className="refuse">Refuse</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendsRequest;