import React, { useEffect, useState } from "react";

import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { HeartIcon as LikedHeart } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkedIcon } from "@heroicons/react/solid";
import Popup from "./Popup";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";
import Cookies from "js-cookie";

function Post({
  profilePhoto,
  postImage,
  numOfLikes,
  userName,
  postDesc,
  numOfComments,
  timeOfPost,
  postId,
  userId,
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [fadePostBtn, setFadePostBtn] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showFullPost, setShowFullPost] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState("");
  const [message, setMessage] = useState("");
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [myComment, setMyComment] = useState("");
  const router = useRouter();
  const [userIn, setUserIn] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const truncate = (desc) => {
    if (!showFullPost) {
      return desc?.substring(0, 90);
    }
    return desc;
  };

  const likePost = async () => {
    const docRef = doc(db, "posts", postId);
    if (!numOfLikes.includes(userInfo?.userId)) {
      const newLikes = [...numOfLikes, userInfo.userId];
      setLiked(true);
      setTotalLikes(newLikes.length);
      try {
        await updateDoc(docRef, {
          numOfLikes: newLikes,
        });
      } catch (err) {
        setOpenSnackbar(true);
        setMessage(err);
      }
    } else {
      unLikePost();
    }
  };
  const unLikePost = async () => {
    const docRef = doc(db, "posts", postId);
    if (numOfLikes.includes(userInfo?.userId)) {
      const newLikes = numOfLikes.filter(
        (likeID) => likeID !== userInfo.userId
      );
      setLiked(false);
      setTotalLikes(newLikes.length);
      try {
        await updateDoc(docRef, {
          numOfLikes: newLikes,
        });
      } catch (err) {
        setOpenSnackbar(true);
        setMessage(err);
      }
    } else {
      likePost();
    }
  };

  const addComment = async () => {
    if (userInfo) {
      const postRef = doc(db, "posts", postId);
      const newComments = [
        ...numOfComments,
        {
          commenterId: userInfo.userId,
          commenterName: userInfo.userName,
          commenterPhoto: userInfo.userPhoto,
          actualComment: myComment,
        },
      ];
      try {
        await updateDoc(postRef, {
          numOfComments: newComments,
        });
        setMyComment("");
        setFadePostBtn(true);
        setTotalComments(newComments.length);
      } catch (err) {
        setOpenSnackbar(true);
        setMessage(err);
        setMyComment("");
        setFadePostBtn(true);
      }
    } else {
      router.push("/login");
    }
  };

  const deletePost = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      await deleteDoc(docRef);
      setOpenSnackbar(true);
      setMessage("Post successfully deleted");
    } catch (err) {
      setOpenSnackbar(true);
      setMessage(err);
    }
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const holdComment = () => {
    dispatch({
      type: "HOLD_COMMENT",
      payload: {
        numOfComments,
        ownersPhoto: profilePhoto,
        postDesc,
        ownersName: userName,
        myPostId: postId,
      },
    });
    Cookies.set(
      "commentDetails",
      JSON.stringify({
        numOfComments,
        ownersPhoto: profilePhoto,
        postDesc,
        ownersName: userName,
        myPostId: postId,
      })
    );
  };

  useEffect(() => {
    setTotalLikes(numOfLikes.length);
    setTotalComments(numOfComments.length);
    if (userInfo) {
      setUserIn(true);
      if (!numOfLikes.includes(userInfo?.userId)) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    }
  }, [userInfo, myComment, numOfComments.length, numOfLikes]);
  return (
    <>
      <Head>
        <link rel="icon" href="/images/instagram_icon.jpg" />
      </Head>
      <div className="lg:border mb-[1rem]">
        <div className="flex px-[1rem] py-[15px] pt-[0.7rem] items-center">
          <img
            style={{ border: "2px solid tomato" }}
            className="w-[45px] rounded-[50%] h-[45px] object-cover p-1"
            src={profilePhoto}
            alt=""
          />
          <p
            style={{ fontWeight: "600" }}
            className="flex-1 ml-[15px] text-[13px]"
          >
            {userName}
          </p>
          <DotsHorizontalIcon
            className="h-7"
            onClick={() => setShowPopup(true)}
          />
        </div>
        <img
          className="h-[400px] lg:h-[550px] object-contain  w-full"
          src={postImage}
          alt="some stuff"
        />
        <div className="pt-[1rem] px-[1rem] text-[14px]">
          <div className="flex justify-between">
            <div className="space-x-[10px] flex">
              {liked ? (
                <LikedHeart
                  onClick={() => {
                    if (userIn) {
                      unLikePost();
                    } else {
                      router.push("/login");
                    }
                  }}
                  className="h-7 cursor-pointer transition-all duration-150 ease-out text-red-500"
                />
              ) : (
                <HeartIcon
                  onClick={() => {
                    if (userIn) {
                      likePost();
                    } else {
                      router.push("/login");
                    }
                  }}
                  className="h-7 hover:opacity-[0.5] cursor-pointer transition-all duration-150 ease-out "
                />
              )}

              <ChatIcon className="h-7 hover:opacity-[0.5] cursor-pointer transition-all duration-150 ease-out" />
              <PaperAirplaneIcon
                style={{ transform: "rotate(45deg)" }}
                className="h-7 hover:opacity-[0.5] cursor-pointer transition-all duration-150 ease-out"
              />
            </div>
            {bookmarked ? (
              <BookmarkedIcon
                onClick={() => setBookmarked(!bookmarked)}
                className="h-7 cursor-pointer transition-all duration-150 ease-out"
              />
            ) : (
              <BookmarkIcon
                onClick={() => setBookmarked(!bookmarked)}
                className="h-7 hover:opacity-[0.5] cursor-pointer transition-all duration-150 ease-out "
              />
            )}
          </div>
          {totalLikes === 1 ? (
            <p className="mt-[0.7rem] font-semi-bold">{totalLikes} like</p>
          ) : (
            <p className="mt-[0.7rem] font-semi-bold">{totalLikes} likes</p>
          )}
          <span
            style={{ fontWeight: "600" }}
            className="cursor-pointer mb-[0.2rem] font-semibold text-[13px]"
          >
            {userName}
          </span>{" "}
          <span>{truncate(postDesc)}</span>
          {!showFullPost ? (
            <span
              className="cursor-pointer text-gray-400"
              onClick={() => setShowFullPost(true)}
            >
              {postDesc?.length > 90 && `... more`}
            </span>
          ) : (
            <span
              className="cursor-pointer text-gray-400"
              onClick={() => setShowFullPost(false)}
            >
              {postDesc.length > 90 && `... see less`}
            </span>
          )}
          {totalComments > 1 ? (
            <p
              className="cursor-pointer text-gray-400 mb-[0.6rem]"
              onClick={() => holdComment()}
            >
              <Link href={`/comment/${postId}`}>
                <a onClick={() => holdComment()}>
                  View all {totalComments} comments
                </a>
              </Link>
            </p>
          ) : totalComments === 1 ? (
            <p className="cursor-pointer text-gray-400 mb-[0.6rem]">
              <Link href={`/comment/${postId}`}>
                <a onClick={() => holdComment()}>View 1 Comment</a>
              </Link>
            </p>
          ) : (
            <p className="cursor-pointer text-gray-400 mb-[0.6rem]">
              <Link href={`/comment/${postId}`}>
                <a onClick={() => holdComment()}>Be the first to comment</a>
              </Link>
            </p>
          )}
          <p className="text-gray-400">{timeOfPost}</p>
          <div className="hidden border-t h-[60px] lg:flex mt-[1rem] text-[18px] items-center">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              placeholder="Add a comment"
              className="flex-grow h-full outline-none border-none mx-[10px]"
              value={myComment}
              onChange={(e) => {
                setMyComment(e.target.value);
                setFadePostBtn(e.target.value.trim() === "" ? true : false);
              }}
            />
            <button
              onClick={() => addComment()}
              disabled={fadePostBtn ? true : false}
              className={`font-bold text-[#2AA6F7] ${
                fadePostBtn && "opacity-[0.4]"
              }`}
            >
              Post
            </button>
          </div>
        </div>
        {showPopup && (
          <Popup setShowPopup={setShowPopup}>
            {!userInfo || userId !== userInfo?.userId ? (
              <>
                <ul className="w-[70vw] md:w-[400px] text-[14px]">
                  <li className="cursor-pointer py-[13px] text-center border-b text-red-500 font-bold">
                    Report
                  </li>
                  <li className="cursor-pointer py-[13px] text-center border-b text-red-500 font-bold">
                    follow
                  </li>
                  <li className="cursor-pointer py-[13px] text-center border-b">
                    Go to post
                  </li>
                  <li className="cursor-pointer py-[13px] text-center border-b">
                    Share to...
                  </li>
                  <li className="cursor-pointer py-[13px] text-center border-b">
                    Copy Link
                  </li>
                  <li className="cursor-pointer py-[13px] text-center border-b">
                    Embed
                  </li>
                  <li
                    className="cursor-pointer hover:bg-gray-200 py-[13px] text-center"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </li>
                </ul>
              </>
            ) : (
              userId === userInfo.userId && (
                <>
                  <ul className="w-[70vw] md:w-[400px] text-[14px]">
                    <li
                      className="cursor-pointer py-[13px] text-center border-b text-red-500"
                      onClick={() => deletePost()}
                    >
                      Delete Post
                    </li>
                    <li
                      className="cursor-pointer hover:bg-gray-200 py-[13px] text-center"
                      onClick={() => setShowPopup(false)}
                    >
                      Cancel
                    </li>
                  </ul>
                </>
              )
            )}
          </Popup>
        )}
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </>
  );
}

export default Post;
