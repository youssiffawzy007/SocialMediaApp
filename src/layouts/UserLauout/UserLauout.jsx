import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/layout/NavBar/NavBar";

export default function UserLauout() {
  return (
    <>
      <div className="">
        <NavBar />
      </div>
      <div className="">
        <Outlet />
      </div>
    </>
  );
}
