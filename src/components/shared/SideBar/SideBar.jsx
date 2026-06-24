import React from 'react'
import { NavLink } from "react-router-dom";
import { Bookmark, Earth, Newspaper, Sparkles } from "lucide-react";
export default function SideBar() {
  return (
    <div className="p-3 mb-4 border border-gray-200 rounded-2xl bg-white flex flex-col gap-1 side-bar min-w-64 shadow xl:fixed xl:left-[3.5%] xl:top-24">
      <div className="flex xl:flex-col gap-2">
        <NavLink
          to="/"
          className="font-bold text-sm w-[50%] xl:w-full text-gray-600 rounded-xl px-3 py-2 flex justify-center xl:justify-start items-center gap-3 hover:bg-gray-100 transition-all"
        >
          <Newspaper size={16} strokeWidth={2.25} />
          <span className="">Feed</span>
        </NavLink>
        <NavLink
          to="/MyPosts"
          className="font-bold text-sm w-[50%] xl:w-full text-gray-600 rounded-xl px-3 py-2 flex justify-center xl:justify-start items-center gap-3 hover:bg-gray-100 transition-all"
        >
          <Sparkles size={16} strokeWidth={2.25} />
          <span className="">My Posts</span>
        </NavLink>
      </div>
      <div className="flex xl:flex-col gap-2">
        <NavLink
          to="/Community"
          className="font-bold text-sm w-[50%] xl:w-full text-gray-600 rounded-xl px-3 py-2 flex justify-center xl:justify-start items-center gap-3 hover:bg-gray-100 transition-all"
        >
          <Earth size={16} strokeWidth={2.25} />
          <span className="">Community</span>
        </NavLink>
        <NavLink
          to="/Saved"
          className="font-bold text-sm w-[50%] xl:w-full text-gray-600 rounded-xl px-3 py-2 flex justify-center xl:justify-start items-center gap-3 hover:bg-gray-100 transition-all"
        >
          <Bookmark size={16} strokeWidth={2.25} />
          <span className="">Saved</span>
        </NavLink>
      </div>
    </div>
  );
}
