import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { TokenContext } from "../../../context/TokenContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

export default function PostCreate() {
  const query = useQueryClient();
  const inputRef = useRef();
  const formData = new FormData();
  const { UserData } = useContext(UserContext);
  const { token } = useContext(TokenContext);
  const [PostImageUrl, setPostImageUrl] = useState(null);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["public"]));
  const privacy = Array.from(selectedKeys)[0];
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );
  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      query.invalidateQueries(["getAllFeedPosts", token]);
      query.invalidateQueries(["getMyPosts", token]);
      query.invalidateQueries(["getAllPosts", token]);
      reset();
      setPostImageUrl(null);
    },
  });
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const { onChange, ref, ...rest } = register("image");
  function createPost() {
    return axios.post(`https://route-posts.routemisr.com//posts`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  function handleCreatePost(values) {

    if (!values?.body && !values?.image[0]) return;
    if (values?.body) {

      formData.append("body", values.body);
    }
    if (values?.image[0]) {

      formData.append("image", values.image[0]);
    }
    formData.append("privacy",privacy)
    mutate();
  }
  function PostImgToURL(e) {
    if (!e.target.files[0]) return;
    setPostImageUrl(URL.createObjectURL(e.target.files[0]));
  }
  return (
    <div className="bg-white p-4 rounded-2xl border-[0.8px] border-[#e2e8f0] w-full xl:max-w-171.25 mx-auto">
      <div className="flex items-center gap-4">
        <img
          alt={UserData.name}
          className="h-11 w-11 rounded-full object-cover ms-1"
          src={UserData.photo}
        />
        <div className="">
          <p className="font-bold">{UserData.name}</p>
          <Dropdown>
            <DropdownTrigger>
              <Button className="capitalize h-6.25" variant="flat">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key="public">Public</DropdownItem>
              <DropdownItem key="following">Followers</DropdownItem>
              <DropdownItem key="only_me">Only me</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex items-start gap-2 pt-3 mx-auto">
        <form className="w-full" onSubmit={handleSubmit(handleCreatePost)}>
          <div
            className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
            data-reply-mention-root="true"
          >
            <textarea
              {...register("body")}
              placeholder={`What's on your mind, ${UserData?.name?.split(" ", 1)}?`}
              rows={4}
              className="max-h-30 min-h-9.5 w-full resize-none bg-transparent px-2 py-1 text-[17px] leading-5 outline-none placeholder:text-slate-500 placeholder:"
              defaultValue={""}
            />
            {PostImageUrl && (
              <div className="relative w-fit mx-auto ">
                <img
                  src={PostImageUrl}
                  alt="Reply img"
                  className="h-50 max-w-100 rounded-lg"
                />
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setPostImageUrl(null);
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
                    <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
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
                      PostImgToURL(e);
                    }}
                    accept="image/*"
                    className="hidden"
                    type="file"
                  />
                </label>
              </div>
              <button
                className="inline-flex h-8 w-8 items-center cursor-pointer justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
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
  );
}
