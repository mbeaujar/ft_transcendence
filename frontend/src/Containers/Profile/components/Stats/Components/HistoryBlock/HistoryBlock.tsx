import React, { useEffect, useState } from "react";
import "./HistoryBlock.scss";
import api from "../../../../../../apis/api";
import { IUser } from "../../../../../../interface/user.interface";

interface Props {
  user: IUser;
}

function HistoryBlock(props: Props) {
  const [historic, setHistoric] = useState<any>();
  useEffect(() => {
    api
      .get(`/users/history/${props.user.id}`)
      .then((response) => console.log("response=", response.data))
      .catch((reject) => console.error(reject));
  }, []);

  return (
    <div className="HistoryBlock">
      <h3 className="title">History</h3>
      <div className="Hitory"></div>
    </div>
  );
}

export default HistoryBlock;
