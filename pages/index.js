import React from "react";
import Router from "next/router";

export default function Index() {
  React.useEffect(() => {
    const { pathname } = Router
    if(pathname == '/') {
      Router.push("/connect")
    }
  })
  return (
    <div />
  );
}