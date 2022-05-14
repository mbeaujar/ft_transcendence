import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router";

function Test(props: any) {
  const { handle }: any = useParams();
  const location: any = useLocation();
  const { from } = location.state;
  const { e } = location.state;
  useEffect(() => {
    console.log("from===", from);
    console.log("fromname===", from.name);
  }, [handle]);

  return (
    <h1>
      Bonjour {from.name} {from.surname}
    </h1>
  );
}

export default Test;
