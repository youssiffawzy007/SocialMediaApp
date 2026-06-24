import {
  Avatar,
  Button,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { TokenContext } from "../../../context/TokenContext";
import { UserContext } from "../../../context/UserContext";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  faEllipsisVertical,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Comment({ data }) {
  const { token } = useContext(TokenContext);
  const { UserData } = useContext(UserContext);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const formData = new FormData();
  const query = useQueryClient();
  const inputRef = useRef();
  const [replyImageUrl, setReplyImageUrl] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const isMyComment = data.commentCreator._id == UserData._id;
  const { isPending, mutate } = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      query.invalidateQueries(["getCommentReply", data._id]);
      reset();
      setReplyImageUrl(null);
    },
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  const { onChange, ref, ...rest } = register("image");
  useEffect(() => {
    if (data?.likes.includes(UserData._id)) {
      setIsLiked(true);
    }
  }, [data, UserData._id]);
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
        url: `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => console.log("gooood"))
      .catch(() => console.log("error"));
    setIsLiked(!isLiked);
  }

  const [isEdit, setIsEdit] = useState(false);
  const EditformData = new FormData();
  const editRef = useRef();
  async function EditComment() {
    if (editRef.current.value && editRef.current.value != data.content) {
      EditformData.append("content", editRef.current.value);
      const dataEdit = await axios
        .put(
          `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}`,
          EditformData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then(() => {
          query.invalidateQueries(["getPost", data.post]);
        });
      console.log(dataEdit);
    }
    setIsEdit(false);
  }

  async function deleteComment() {
    const dataDeleted = await axios
      .delete(
        `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        query.invalidateQueries(["getPost", data.post]);
      });
    console.log(dataDeleted);
  }

  function createReply() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/replies`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
  function handleCreateReply(values) {
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
  function replyImgToURL(e) {
    if (!e.target.files[0]) return;
    setReplyImageUrl(URL.createObjectURL(e.target.files[0]));
  }
  function getCommentReply() {
    return axios.request({
      method: "GET",
      url: `https://route-posts.routemisr.com/posts/${data.post}/comments/${data._id}/replies?page=1&limit=50`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { data: CommentReplyData, isLoading } = useQuery({
    queryKey: ["getCommentReply", data._id],
    queryFn: getCommentReply,
    enabled: !!data.repliesCount && replyOpen,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });


  return (
    <CardHeader className=" block justify-between rounded-2xl my-1  w-full">
      <div className={`flex gap-4`}>
        <Link
          to={`/profile/${data?.commentCreator?._id}`}
          className="rounded-full"
        >
          <Avatar
            isBordered
            radius="full"
            className="cursor-pointer"
            size="sm"
            src={data?.commentCreator?.photo}
          />
        </Link>
        <div className="flex flex-col gap-0.5 items-start justify-center">
          <h4 className="text-xs font-semibold leading-none text-black mt-0.5">
            {data?.commentCreator?.name}
          </h4>
          <h5 className="text-xs tracking-tight text-default-400">
            @{data?.commentCreator?.username} . {timeAgoShort(data?.createdAt)}
          </h5>
          {data?.content && !isEdit && (
            <p className="text-sm mb-1">{data.content}</p>
          )}
          {isEdit && (
            <div className="mt-2 flex items-center gap-2">
              <input
                ref={editRef}
                className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
                defaultValue={data.content}
              />
              <button
                onClick={EditComment}
                className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
              >
                Save
              </button>
              <button
                onClick={() => setIsEdit(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          )}
          {data.image && (
            <img
              src={data?.image}
              alt="Comment image"
              className="h-51.75 mt-1 rounded-lg"
            />
          )}
          <div className="">
            <button
              onClick={likeToggel}
              className={`text-xs font-semibold cursor-pointer me-3  hover:underline transition-all ${isLiked ? "text-blue-600" : "text-[#62748e]"}`}
            >
              Like ({data?.likes.length + like})
            </button>
            {data.isReply == undefined && (
              <button
                onClick={() => {
                  setReplyOpen(!replyOpen);
                }}
                className="text-xs font-semibold cursor-pointer text-[#62748e] hover:underline hover:text-blue-600 transition-all"
              >
                Reply {data.repliesCount && `(${data.repliesCount})`}
              </button>
            )}
            {replyOpen && (
              <div className="mt-2 p-4 relative" data-reply-tools-root="true">
                <span className="absolute bottom-10 left-0 top-1 w-px rounded-full bg-slate-300"></span>
                {isLoading && (
                  <p className="text-xs text-[#62748e] mb-1">
                    Reply is loading....
                  </p>
                )}
                {CommentReplyData &&
                  CommentReplyData?.data.data.replies?.map((reply) => (
                    <Comment key={reply._id} data={reply} />
                  ))}
                {!data.repliesCount && (
                  <p className="text-xs text-[#62748e] mb-1">No replies yet.</p>
                )}
                <p className="mb-1 text-[11px] font-semibold text-slate-500">
                  Replying to {data?.commentCreator.name}
                </p>
                <div className="flex items-start gap-2">
                  <img
                    alt={UserData.name}
                    className="mt-0.5 h-7 w-7 rounded-full object-cover"
                    src={UserData.photo}
                  />
                  <form onSubmit={handleSubmit(handleCreateReply)}>
                    <div
                      className="w-125 rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
                      data-reply-mention-root="true"
                    >
                      <textarea
                        {...register("body")}
                        placeholder="Write a reply..."
                        rows={1}
                        className="max-h-30 min-h-9.5 w-full resize-none bg-transparent px-2 py-1 text-xs leading-5 outline-none placeholder:text-slate-500"
                        defaultValue={""}
                      />
                      {replyImageUrl && (
                        <div className="relative w-fit mx-auto ">
                          <img
                            src={replyImageUrl}
                            alt="Reply img"
                            className="h-50 max-w-100 rounded-lg"
                          />
                          <button
                            className="cursor-pointer"
                            onClick={() => {
                              setReplyImageUrl(null);
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
                                replyImgToURL(e);
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
              </div>
            )}
          </div>
        </div>
        {isMyComment && (
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
              disabledKeys={isEdit && ["edit"]}
              variant="faded"
            >
              <DropdownItem
                key="edit"
                onClick={() => {
                  setIsEdit(true);
                }}
                startContent={<FontAwesomeIcon icon={faPenToSquare} />}
              >
                Edit Comment
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
                      title: "Delete this comment?",
                      text: "This comment will be permanently removed.",
                      icon: "warning",
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      showCancelButton: true,
                      confirmButtonText: "Delete comment",
                      cancelButtonText: "Cancel",
                      reverseButtons: true,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        deleteComment();
                        swalWithBootstrapButtons.fire({
                          title: "Deleted!",
                          text: "Your Comment has been deleted.",
                          icon: "success",
                        });
                      } else if (result.dismiss === Swal.DismissReason.cancel)
                        swalWithBootstrapButtons.fire({
                          title: "Cancelled",
                          text: "Your imaginary Comment is safe ",
                          icon: "error",
                        });
                    });
                }}
                startContent={
                  <FontAwesomeIcon className="text-red-500" icon={faTrashCan} />
                }
              >
                Delete Comment
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </CardHeader>
  );
}
