import { useContext } from "react";
import { useParams } from "react-router-dom";
import { TokenContext } from "../../../context/TokenContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import PostLoading from "../PostLoading/PostLoading";
import Post from "../posts/Post";
import BackButton from "../BackButton/BackButton";
export default function PostDetails() {
  const { id } = useParams();
  const { token } = useContext(TokenContext);
  function getPost() {
    return axios.request({
      method: "GET",
      url: `https://route-posts.routemisr.com/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { data, isError, isLoading } = useQuery({
    queryKey: ["getPost", id],
    queryFn: getPost,
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });
  return (
    <div className="container mx-auto w-full pt-19 xl:max-w-171.25">
      <BackButton className="mt-2" />
      {isLoading && (
        <div className="flex justify-center ">
          <PostLoading />
        </div>
      )}

      {isError && (
        <div className="flex justify-center">
          <p className="text-center text-2xl font-semibold text-gray-600  bg-white p-10 rounded-2xl border border-gray-200 w-170.5  ">
            Error, please try again later.
          </p>
        </div>
      )}

      {data && (

          <Post data={data?.data.data.post} />

      )}
    </div>
  );
}
