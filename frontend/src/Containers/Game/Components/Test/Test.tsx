import React from "react";
import { useLocation } from "react-router";

function Test(props: any) {
  const location:any = useLocation()
  const { from } = location.state.from;
  return (<h1>Bonjour {from}</h1>);
}

export default Test;