import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router";

function Test(props: any) {
  let from: any = null;
  let { handle }: any = useParams();
  let location = useLocation();
  if (location) from = location.state;

  useEffect(() => {
    if (from) console.log("from:::", from.from);
  }, [handle]);

  return (
    <div>
      {from ? (
        <h1>
          Bonjour {from.from.name} {from.from.surname}
        </h1>
      ) : (
        <h1>You cannot access this page</h1>
      )}
    </div>
  );
}

export default Test;
