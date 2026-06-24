import React, { useContext, useEffect, useRef, useState } from "react";
import { faCamera, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../context/TokenContext";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import MyPosts from "../HomeChildren/MyPosts/MyPosts";

export default function Profile() {
  const { UserData, saveUser } = useContext(UserContext);
  const { token } = useContext(TokenContext);
  const { id: ProfileURLID } = useParams();
  const isMyProfile = !ProfileURLID || ProfileURLID === UserData?._id;
  const [isFollowed, setIsFollowed] = useState(false);
  const [postsCount, setPostsCount] = useState(0);

  console.log(isMyProfile);

  const ChangeCoverRef = useRef();
  const AddCoverRef = useRef();
  const AddPhotoRef = useRef();
  const query = useQueryClient();

  async function ChangeCoverPost() {
    const ChangeCoverformData = new FormData();
    if (ChangeCoverRef?.current?.files[0]) {
      ChangeCoverformData.append("cover", ChangeCoverRef?.current?.files[0]);
      const dataChangeCover = await axios
        .put(
          `https://route-posts.routemisr.com/users/upload-cover`,
          ChangeCoverformData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          query.invalidateQueries(["getProfile", ProfileURLID]);
          ChangeCoverRef.current.value = "";
        });
      console.log(dataChangeCover);
    } else if (AddCoverRef?.current?.files[0]) {
      ChangeCoverformData.append("cover", AddCoverRef?.current?.files[0]);
      const dataAddCover = await axios
        .put(
          `https://route-posts.routemisr.com/users/upload-cover`,
          ChangeCoverformData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          query.invalidateQueries(["getProfile", ProfileURLID]);
          AddCoverRef.current.value = "";
        });
      console.log(dataAddCover);
    }
  }
  async function RemoveCover() {
    const dataRemoveCover = await axios
      .delete(`https://route-posts.routemisr.com/users/cover`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        query.invalidateQueries(["getProfile", ProfileURLID]);
      });
    console.log(dataRemoveCover);
  }

  async function ChangeUserPhoto() {
    const ChangephotoformData = new FormData();
    if (AddPhotoRef?.current?.files[0]) {
      ChangephotoformData.append("photo", AddPhotoRef?.current?.files[0]);
      const dataChangePhoto = await axios
        .put(
          `https://route-posts.routemisr.com/users/upload-photo`,
          ChangephotoformData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          query.invalidateQueries(["getProfile", ProfileURLID]);
          AddPhotoRef.current.value = "";
        });
      const updatedProfile = await query.fetchQuery({
        queryKey: ["getProfile", ProfileURLID],
      });
      
      const updatedUser = updatedProfile?.data?.data?.user;

      if (
        updatedUser &&
        typeof updatedUser === "object" &&
        Object.keys(updatedUser).length > 0
      ) {
        saveUser(updatedUser);
      }
    }
  }

  function getMyProfileData() {
    return axios.request({
      method: "GET",
      url: "https://route-posts.routemisr.com/users/profile-data",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  function getProfileData() {
    return axios.request({
      method: "GET",
      url: `https://route-posts.routemisr.com/users/${ProfileURLID}/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async function followUser() {
    const datafollowing = await axios.request({
      method: "put",
      url: `https://route-posts.routemisr.com/users/${ProfileURLID}/follow`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log(datafollowing);
    setIsFollowed(datafollowing?.data?.data?.following);
  }
  const { data } = useQuery({
    queryKey: ["getProfile", ProfileURLID],
    queryFn: isMyProfile ? getMyProfileData : getProfileData,
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });
  useEffect(() => {
    if (data?.data?.data?.isFollowing) {
      setIsFollowed(data?.data?.data?.isFollowing);
    }
  }, [data, UserData._id]);

  return (
    <div className="container mx-auto px-4 max-w-317 pt-20">
      <div className="">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
          <div
            className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60"
            style={
              data?.data?.data?.user?.cover
                ? {
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.4)), url(${data?.data?.data?.user?.cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]" />
            <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl" />
            <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
            <div
              className={`pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100 ${!isMyProfile && "hidden"}`}
            >
              {!data?.data?.data?.user?.cover ? (
                <label
                  className={`pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs`}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  Add cover
                  <input
                    ref={AddCoverRef}
                    onChange={ChangeCoverPost}
                    accept="image/*"
                    className="hidden"
                    type="file"
                  />
                </label>
              ) : (
                <>
                  <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <FontAwesomeIcon icon={faCamera} />
                    Change cover
                    <input
                      ref={ChangeCoverRef}
                      onChange={ChangeCoverPost}
                      accept="image/*"
                      className="hidden"
                      type="file"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={RemoveCover}
                    className="pointer-events-auto cursor-pointer inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
            <div className="rounded-3xl border border-white/60 bg-white/92 p-5  backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-end gap-4">
                    <div className="group/avatar relative shrink-0">
                      <button type="button" className="rounded-full">
                        <img
                          alt={data?.data?.data?.user?.name}
                          className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                          src={data?.data?.data?.user?.photo}
                        />
                      </button>
                      {/* <button
                        type="button"
                        className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
                        title="View profile photo"
                        aria-label="View profile photo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-expand"
                          aria-hidden="true"
                        >
                          <path d="m15 15 6 6" />
                          <path d="m15 9 6-6" />
                          <path d="M21 16v5h-5" />
                          <path d="M21 8V3h-5" />
                          <path d="M3 16v5h5" />
                          <path d="m3 21 6-6" />
                          <path d="M3 8V3h5" />
                          <path d="M9 9 3 3" />
                        </svg>
                      </button> */}
                      <label
                        className={`absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100 ${!isMyProfile && "hidden"}`}
                      >
                        <FontAwesomeIcon icon={faCamera} />
                        <input
                          ref={AddPhotoRef}
                          onChange={ChangeUserPhoto}
                          accept="image/*"
                          className="hidden"
                          type="file"
                        />
                      </label>
                    </div>
                    <div className="min-w-0 pb-1">
                      <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {data?.data?.data?.user?.name}
                      </h2>
                      <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                        @{data?.data?.data?.user?.username}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={13}
                          height={13}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-users"
                          aria-hidden="true"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <circle cx={9} cy={7} r={4} />
                        </svg>
                        Route Posts member
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`grid w-full grid-cols-3 gap-2 lg:w-130 ${!isMyProfile && "hidden"}`}
                >
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Followers
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {data?.data?.data?.user.followersCount || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Following
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {data?.data?.data?.user.followingCount || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                      Bookmarks
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                      {data?.data?.data?.user.bookmarksCount || 0}
                    </p>
                  </div>
                </div>
                {!isMyProfile ? (
                  <Button
                    className={
                      isFollowed
                        ? "bg-transparent text-foreground border-default-200"
                        : ""
                    }
                    color="primary"
                    radius="full"
                    size="md"
                    variant={isFollowed ? "bordered" : "solid"}
                    onPress={() => {
                      setIsFollowed(!isFollowed);
                      followUser();
                    }}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </Button>
                ) : null}
              </div>
              <div
                className={`mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr] ${!isMyProfile && "hidden"}`}
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-extrabold text-slate-800">
                    About
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail text-slate-500"
                        aria-hidden="true"
                      >
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x={2} y={4} width={20} height={16} rx={2} />
                      </svg>
                      {data?.data?.data?.user?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-users text-slate-500"
                        aria-hidden="true"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <circle cx={9} cy={7} r={4} />
                      </svg>
                      Active on Route Posts
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                      My posts
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {postsCount || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                      Saved posts
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {data?.data?.data?.user?.bookmarksCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center w-full">
          {isMyProfile ? (
            <MyPosts setPostsCount={setPostsCount} Myid={UserData._id} />
          ) : (
            <MyPosts setPostsCount={setPostsCount} Myid={ProfileURLID} />
          )}
        </div>
      </div>
    </div>
  );
}
