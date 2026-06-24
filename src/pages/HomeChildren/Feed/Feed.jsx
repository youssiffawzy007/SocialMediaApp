import React, { useContext } from "react";
import Post from "../../../components/shared/posts/Post";
import axios from "axios";
import { TokenContext } from "../../../context/TokenContext";
import { useQuery } from "@tanstack/react-query";
import PostLoading from "../../../components/shared/PostLoading/PostLoading";
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
export default function Feed() {
  const { token, deleteToken } = useContext(TokenContext);
  const { deleteUser } = useContext(UserContext);
  const navigate = useNavigate();
  function getFeed() {
    return axios.request({
      method: "GET",
      url: "https://route-posts.routemisr.com/posts/feed?only=following&limit=40",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { data, isError, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: ["getAllFeedPosts", token],
    queryFn: getFeed,
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
    throwOnError: (error) => {
      console.log(error.response?.status);
      console.log("erroooooooooor");

      if (error.response?.status === 401) {
        deleteToken();
        deleteUser();
        navigate("/login");
      }
    },
  });
  console.log(data?.data.data.posts);
  if (isLoading) {
    return (
      <div className="flex flex-col w-full mt-5">
        <PostLoading />
        <PostLoading />
      </div>
    );
  }


  if (isError) {
    return (
      <p className="text-center text-2xl font-semibold text-gray-600 mt-3 bg-white p-10 rounded-2xl border border-gray-200 w-full mx-auto">
        Error, please try again later.
      </p>
    );
  }
  if (isSuccess && data?.data?.data?.posts?.length === 0) {
    return (
      <>
        <p className="text-center text-2xl font-semibold text-gray-600 mt-3 bg-white p-10 rounded-2xl border border-gray-200 w-full mx-auto">
          No posts yet. Be the first one to publish.
        </p>
      </>
    );
  }
  return (
    <>
      {isFetching && (
        // <div className=" bg-amber-200 w-40 h-40"></div>
        <div className="mt-20 z-50 fixed top-[1%]">
          <CircularProgress size={30} aria-label="Loading…" />
        </div>
      )}
      <div className="w-full">
        {data?.data?.data?.posts?.map((post) => (
          <Post key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}
