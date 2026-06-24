import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { UserContext } from "../../../context/UserContext";
import {
  faBookmark as solidBookmark,
  faShare,
  faThumbsUp as solidThumb,
  faEllipsisVertical,
  faPenToSquare,
  faTrashCan,
  faArrowUpRightFromSquare,
  faSpinner,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faBookmark as regularBookmark,
  faThumbsUp as regularThumb,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { TokenContext } from "../../../context/TokenContext";
import { Link, NavLink, useMatch, useParams } from "react-router-dom";
import Comment from "../Comment/Comment";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function Post({ data, sharedPost = false }) {
  console.log(data);
  const { id: PostURLID } = useParams();
  const isPostDetails = !!useMatch("/post/:id");
  const { UserData } = useContext(UserContext);
  const { token } = useContext(TokenContext);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState();
  const [isBookMarked, setIsBookMarked] = useState();
  // const [isFollowed, setIsFollowed] = useState();
  const formData = new FormData();
  const [CommentAria, setCommentAria] = useState(true);
  const [CommentImageUrl, setCommentImageUrl] = useState(null);
  const query = useQueryClient();
  const inputRef = useRef();

  const [isEdit, setIsEdit] = useState(false);
  const EditformData = new FormData();
  const editRef = useRef();
  const ShareRef = useRef();
  async function EditPost() {
    if (editRef.current.value && editRef.current.value != data.body) {
      EditformData.append("body", editRef.current.value);
      const dataEdit = await axios
        .put(
          `https://route-posts.routemisr.com/posts/${data._id}`,
          EditformData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          query.invalidateQueries(["getAllFeedPosts", token]);
          query.invalidateQueries(["getMyPosts", token]);
          query.invalidateQueries(["getAllPosts", token]);
          query.invalidateQueries(["getPost", data._id]);
        });
      console.log(dataEdit);
    }
    setIsEdit(false);
  }

  async function deletePost() {
    const dataDeleted = await axios
      .delete(`https://route-posts.routemisr.com/posts/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        query.invalidateQueries(["getAllFeedPosts", token]);
        query.invalidateQueries(["getMyPosts", token]);
        query.invalidateQueries(["getAllPosts", token]);
        query.invalidateQueries(["getPost", data._id]);
      });
    console.log(dataDeleted);
  }

  async function SharePost() {
    let shareData = null;
    if (ShareRef.current.value) {
      shareData = {
        body: ShareRef.current.value,
      };
    }
    const dataShared = await axios
      .post(
        `https://route-posts.routemisr.com/posts/${data._id}/share`,
        shareData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        query.invalidateQueries(["getAllFeedPosts", token]);
        query.invalidateQueries(["getMyPosts", token]);
        query.invalidateQueries(["getAllPosts", token]);
        query.invalidateQueries(["getPost", data._id]);
        shareData = null;
        ShareRef.current.value = "";
      });
    console.log(dataShared);
  }

  const isMyPost = data?.user._id == UserData?._id;
  useEffect(() => {
    if (data?.likes) {
      setIsLiked(data?.likes.includes(UserData._id));
    }
    if (data?.bookmarked) {
      setIsBookMarked(data?.bookmarked);
    }
  }, [data, UserData._id]);

  // const [isFollowed, setIsFollowed] = React.useState(false);
  function timeAgoShort(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diff = Math.floor((now - past) / 1000);

    const units = [
      { label: "y", value: 31536000 },
      { label: "M", value: 2592000 },
      { label: "d", value: 86400 },
      { label: "h", value: 3600 },
      { label: "m", value: 60 },
      { label: "s", value: 1 },
    ];

    for (let unit of units) {
      const result = Math.floor(diff / unit.value);
      if (result >= 1) {
        return `${result}${unit.label}`;
      }
    }

    return "0s";
  }
  function likeToggel() {
    if (isLiked) {
      setLike(like - 1);
    } else {
      setLike(like + 1);
    }
    axios
      .request({
        method: "PUT",
        url: `https://route-posts.routemisr.com/posts/${data?._id}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => console.log("gooood"))
      .catch(() => console.log("error"));
    setIsLiked(!isLiked);
  }
  function BookMarkToggel() {
    axios
      .request({
        method: "PUT",
        url: `https://route-posts.routemisr.com/posts/${data?._id}/bookmark`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => console.log("gooood"))
      .catch(() => console.log("error"));
    setIsBookMarked(!isBookMarked);
  }
  function getComment(page = 1) {
    return axios.request({
      method: "GET",
      url: `https://route-posts.routemisr.com/posts/${PostURLID}/comments?page=${page}&limit=5`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      query.invalidateQueries(["getAllComment", PostURLID]);
      reset();
      setCommentImageUrl(null);
    },
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareModal = isOpen && (
    <Modal isOpen={isOpen} size="xl" backdrop="blur" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Share post
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3 p-4">
                <textarea
                  ref={ShareRef}
                  placeholder="Say something about this..."
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"
                  defaultValue={""}
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <img
                      alt={data?.user?.name}
                      className="h-8 w-8 rounded-full object-cover"
                      src={data?.user?.photo}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {data?.user?.name}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        @{data?.user?.username}
                      </p>
                    </div>
                  </div>
                  {data?.body && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                      {data?.body}
                    </p>
                  )}
                  {data?.image && (
                    <img
                      alt="post preview"
                      className="mt-2 max-h-55 w-full rounded-lg object-cover"
                      src={data?.image}
                    />
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  SharePost();
                  onClose();
                }}
              >
                Share now
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const { onChange, ref, ...rest } = register("image");
  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${data._id}/comments`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
  function handleCreateComment(values) {
    console.log(values?.image[0]);

    if (!values?.body && !values?.image[0]) return;
    if (values?.body) {
      console.log("from body");
      formData.append("content", values.body);
    }
    if (values?.image[0]) {
      console.log("from image");
      formData.append("image", values.image[0]);
    }

    mutate();
  }
  function CommentImgToURL(e) {
    if (!e.target.files[0]) return;
    setCommentImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  const {
    data: CommentData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getAllComment", PostURLID],
    queryFn: ({ pageParam = 1 }) => getComment(pageParam),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.meta?.pagination;
      if (!pagination) return undefined;
      const { currentPage, numberOfPages } = pagination;
      if (currentPage >= numberOfPages) return undefined;
      return currentPage + 1;
    },
    enabled: !!PostURLID && isPostDetails,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });

  const comments = CommentData?.pages?.flatMap(
    (page) => page.data.data.comments,
  );
  console.log(comments);

  return (
    <Card
      className={
        sharedPost ? "mx-auto bg-gray-200/80 w-full mt-3" : "w-full mt-4 mb-1.5"
      }
      fullWidth
    >
      <CardHeader className="justify-between border-b border-gray-200">
        <div className={`flex gap-5`}>
          <Link to={`/profile/${data?.user?._id}`} className="rounded-full">
            <Avatar
              isBordered
              radius="full"
              className="cursor-pointer"
              size={sharedPost ? "sm" : "md"}
              src={data?.user?.photo}
            />
          </Link>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-bold leading-none text-black">
              {data?.user?.name}
            </h4>
            <h5 className="text-xs tracking-tight text-default-400">
              {timeAgoShort(data?.createdAt)} . {data?.privacy}
            </h5>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Link
            to={`/post/${data?._id}`}
            className="text-xs font-semibold text-[#1877f2] px-2 py-1 rounded-lg transition-all hover:bg-[#dfeefd]"
          >
            {sharedPost ? "Original Post " : "View details "}
            <FontAwesomeIcon
              className="text-xs"
              icon={faArrowUpRightFromSquare}
            />
          </Link>
          {/* <Button
            className={
              isFollowed
                ? "bg-transparent text-foreground border-default-200"
                : ""
            }
            color="primary"
            radius="full"
            size="sm"
            variant={isFollowed ? "bordered" : "solid"}
            onPress={() => setIsFollowed(!isFollowed)}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button> */}
          {isMyPost && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="p-1.5 rounded-full min-w-fit h-[29.5px]"
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Dropdown menu with icons"
                variant="faded"
                disabledKeys={isEdit && ["edit"]}
              >
                <DropdownItem
                  key="edit"
                  startContent={<FontAwesomeIcon icon={faPenToSquare} />}
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  Edit post
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => {
                    const swalWithBootstrapButtons = Swal.mixin({
                      customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger",
                      },
                    });
                    swalWithBootstrapButtons
                      .fire({
                        title: "Delete this Post?",
                        text: "This Post will be permanently removed.",
                        icon: "warning",
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        showCancelButton: true,
                        confirmButtonText: "Delete Post",
                        cancelButtonText: "Cancel",
                        reverseButtons: true,
                      })
                      .then((result) => {
                        if (result.isConfirmed) {
                          deletePost();
                          swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your Post has been deleted.",
                            icon: "success",
                          });
                        } else if (result.dismiss === Swal.DismissReason.cancel)
                          swalWithBootstrapButtons.fire({
                            title: "Cancelled",
                            text: "Your imaginary Post is safe ",
                            icon: "error",
                          });
                      });
                  }}
                  startContent={
                    <FontAwesomeIcon
                      className="text-red-500"
                      icon={faTrashCan}
                    />
                  }
                >
                  Delete post
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-3 pt-0 text-small text-gray-900 overflow-y-visible">
        {data.body && !isEdit && <p className="mb-4 mt-4">{data?.body}</p>}
        {isEdit && data.body && (
          <div className="mt-3">
            <textarea
              maxLength={5000}
              ref={editRef}
              defaultValue={data.body}
              className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:ring-2"
            />
            <div className="my-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEdit(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={EditPost}
                className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        )}
        {data.image && (
          <>
            {/* <img
              src={data?.image}
              className="w-162.5 max-h-162.5 mx-auto object-cover "
            /> */}
            <div className="group relative flex w-full items-center justify-center">
              <img
                alt="post"
                className="max-h-140 w-auto max-w-full object-contain z-40"
                src={data?.image}
              />
              <span className="pointer-events-none absolute inset-0 bg-black/90 transition" />
            </div>
          </>
        )}
        {data.sharedPost && <Post data={data?.sharedPost} sharedPost={true} />}
      </CardBody>
      {!sharedPost && (
        <CardFooter className="gap-3">
          <div className="">
            <div
              className={`flex justify-start items-center px-2.5 py-1.5 rounded-md`}
            >
              <div
                title="Like"
                onClick={likeToggel}
                className={`flex justify-center items-center cursor-pointer px-2.5 py-1.5 rounded-md transition-all ${isLiked ? "text-blue-500 hover:bg-blue-100/50" : "text-[#65686c] hover:bg-[#F1F5F9]"}`}
              >
                {isLiked ? (
                  <FontAwesomeIcon className="text-xl" icon={solidThumb} />
                ) : (
                  <FontAwesomeIcon className="text-xl" icon={regularThumb} />
                )}
                {data?.likesCount + like > 0 && (
                  <span className="text-sm font-semibold ms-1">
                    {data?.likesCount + like}
                  </span>
                )}
              </div>
              <Link
                to={`/post/${data?._id}`}
                onClick={() => {
                  setCommentAria(!CommentAria);
                }}
                title="Comment"
                className={`flex justify-center items-center cursor-pointer px-2.5 py-1.5 rounded-md transition-all text-[#65686c] hover:bg-[#F1F5F9]`}
              >
                <FontAwesomeIcon className="text-xl" icon={faComment} />
                {data?.commentsCount > 0 && (
                  <span className="text-sm font-semibold ms-1">
                    {data?.commentsCount}
                  </span>
                )}
              </Link>
              <button
                title="Share"
                onClick={onOpen}
                className={`flex justify-center items-center cursor-pointer px-2.5 py-1.5 rounded-md transition-all text-[#65686c] hover:bg-[#F1F5F9]`}
              >
                <FontAwesomeIcon className="text-xl" icon={faShare} />
              </button>
              {shareModal}
              <button
                title="Book Mark"
                onClick={BookMarkToggel}
                className={`flex justify-center items-center cursor-pointer px-2.5 py-1.5 rounded-md transition-all  ${isBookMarked ? " hover:bg-blue-100/50 text-[#CFB53B]" : " hover:bg-[#F1F5F9] text-[#65686c]"}`}
              >
                {isBookMarked ? (
                  <FontAwesomeIcon className="text-xl" icon={solidBookmark} />
                ) : (
                  <FontAwesomeIcon className="text-xl" icon={regularBookmark} />
                )}
              </button>
            </div>
          </div>
        </CardFooter>
      )}
      {PostURLID && isPostDetails && !sharedPost && CommentAria && (
        <>
          {comments?.map((comment) => (
            <div key={comment._id} className="bg-gray-100">
              <Comment data={comment} />
            </div>
          ))}
          {hasNextPage && (
            <div className="bg-gray-100 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-xs font-semibold px-4 py-2 mx-auto border-[0.8px] bg-white border-[#cad5e2] mb-3 rounded-full transition-all cursor-pointer hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage ? "Loading...." : "View more comments"}
              </button>
            </div>
          )}
          {
            <div className="flex items-start gap-2 bg-gray-100 py-3 px-4">
              <img
                alt={UserData.name}
                className="mt-0.5 h-7 w-7 rounded-full object-cover"
                src={UserData.photo}
              />
              <form
                className="w-full"
                onSubmit={handleSubmit(handleCreateComment)}
              >
                <div
                  className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
                  data-reply-mention-root="true"
                >
                  <textarea
                    {...register("body")}
                    placeholder={`Comment as ${UserData.name}...`}
                    rows={2}
                    className="max-h-30 min-h-9.5 w-full resize-none bg-transparent px-2 py-1 text-sm leading-5 outline-none placeholder:text-slate-500"
                    defaultValue={""}
                  />
                  {CommentImageUrl && (
                    <div className="relative w-fit mx-auto ">
                      <img
                        src={CommentImageUrl}
                        alt="Reply img"
                        className="h-50 max-w-100 rounded-lg"
                      />
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          setCommentImageUrl(null);
                          inputRef.current.value = null;
                        }}
                      >
                        <FontAwesomeIcon
                          className="absolute top-1.5 right-2 text-white"
                          icon={faCircleXmark}
                        />
                      </button>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-image"
                          aria-hidden="true"
                        >
                          <rect
                            width={18}
                            height={18}
                            x={3}
                            y={3}
                            rx={2}
                            ry={2}
                          />
                          <circle cx={9} cy={9} r={2} />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                        <input
                          {...{ ...rest }}
                          ref={(e) => {
                            ref(e);
                            inputRef.current = e;
                          }}
                          onChange={(e) => {
                            onChange(e);
                            CommentImgToURL(e);
                          }}
                          accept="image/*"
                          className="hidden"
                          type="file"
                        />
                      </label>
                    </div>
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full cursor-pointer bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100"
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <FontAwesomeIcon
                          className="animate-spin"
                          icon={faSpinner}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-send-horizontal"
                          aria-hidden="true"
                        >
                          <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                          <path d="M6 12h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          }
        </>
      )}
    </Card>
  );
}
