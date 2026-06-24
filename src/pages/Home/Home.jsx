import React from "react";
import SideBar from "../../components/shared/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import PostCreate from "../../components/shared/PostCreate/PostCreate";


export default function Home() {
  return (
    <div className="container mx-auto w-full home relative pt-20">
      <SideBar />
      <PostCreate />
      <div className="flex justify-center xl:max-w-171.25 mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
