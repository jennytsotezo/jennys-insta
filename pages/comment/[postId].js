import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowUp";
import { Avatar } from "@mui/material";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";

function CommentSection() {
  const dispatch = useDispatch();
  const [fadePostBtn, setFadePostBtn] = useState(true);
  const [myComment, setMyComment] = useState("");
  const router = useRouter();
  const [postId, setPostId] = useState("");
  const [comments, setComments] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const commentDetails = useSelector((state) => state.user.commentDetails);
  const [myCommentDetails, setmyCommentDetails] = useState({});

  const divRef = useRef();
  const scroll = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  useEffect(() => {
    setPostId(router?.query?.postId);
    setmyCommentDetails({
      numOfComments: commentDetails?.numOfComments,
      ownersPhoto: commentDetails?.ownersPhoto,
      ownersName: commentDetails?.ownersName,
      postDesc: commentDetails?.postDesc,
      myPostId: commentDetails?.myPostId,
    });
  }, [commentDetails, router?.query?.postId]);

  useEffect(() => {
    if (commentDetails) {
      const unsubscribe = onSnapshot(
        doc(db, "posts", commentDetails?.myPostId),
        (snapshot) => {
          setComments(snapshot.data().numOfComments);
        }
      );

      return unsubscribe;
    } else {
      alert("hello");
    }
  }, [commentDetails, router?.query?.postId]);

  const addComment = async () => {
    if (userInfo) {
      if (myComment.trim() !== "") {
        const postRef = doc(db, "posts", postId);
        const newComments = [
          ...myCommentDetails.numOfComments,
          {
            commenterId: userInfo.userId,
            commenterName: userInfo.userName,
            commenterPhoto: userInfo.userPhoto,
            actualComment: myComment,
          },
        ];
        dispatch({
          type: "HOLD_COMMENT",
          payload: {
            numOfComments: newComments,
            ownersPhoto: commentDetails?.ownersPhoto,
            ownersName: commentDetails?.ownersName,
            postDesc: commentDetails?.postDesc,
            myPostId: commentDetails?.myPostId,
          },
        });
        try {
          await updateDoc(postRef, {
            numOfComments: newComments,
          });
          setMyComment("");
          setFadePostBtn(true);
          scroll();
        } catch (err) {
          setMyComment("");
          setFadePostBtn(true);
        }
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className=" overflow-x-hidden">
      {" "}
      <div
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        className="h-[55px] md:h-[60px] px-[15px] sticky top-0 left-0 w-full z-[100]"
      >
        <div className="flex items-center h-full justify-between lg:max-w-[940px] lg:mx-auto">
          <div className="back-btn">
            <KeyboardArrowLeftIcon
              style={{ transform: "rotate(-90deg)" }}
              sx={{ width: 40, height: 40 }}
              onClick={() => router.push("/")}
            />
          </div>
          <p className="font-bold">Comments</p>
          <PaperAirplaneIcon
            style={{ transform: "rotate(45deg)" }}
            className="h-7 "
            onClick={() => addComment()}
          />
        </div>
      </div>
      <div className="flex lg:max-w-[940px] lg:mx-auto items-center lg:max-w-[940px] lg:mt-5 mobile-padding px-[1.2rem] py-[1rem] bg-gray-200 mobile-search-container">
        <div className="mr-[1rem] md:mr-[2rem] user-image-mobile">
          <Avatar
            src={userInfo && userInfo.userPhoto}
            sx={{ width: 35, height: 35 }}
          />
        </div>
        <div className="flex flex-1 items-center bg-white rounded-full input-container-mobile">
          <input
            type="text"
            placeholder="Add a comment..."
            className=" outline-none flex-1 border-none mx-[10px] px-[8px] py-[10px] md:px-[13px] md:py-[10px] rounded-full"
            value={myComment}
            onChange={(e) => {
              setMyComment(e.target.value);
              setFadePostBtn(e.target.value.trim() === "" ? true : false);
            }}
          />
          <button
            onClick={() => addComment()}
            disabled={fadePostBtn ? true : false}
            className={`font-bold text-[#2AA6F7] mr-[15px] md:mr-[1rem] ${
              fadePostBtn && "opacity-[0.4]"
            }`}
          >
            Post
          </button>
        </div>
      </div>
      <div className="mx-[1.21rem] lg:max-w-[900px] lg:mx-auto">
        <div className="mr-[1rem] md:mr-[2rem] user-image-mobile">
          <div className="border-b pb-[20px] mt-[15px] flex space-x-[15px]">
            <Avatar
              src={userInfo && myCommentDetails.ownersPhoto}
              sx={{ width: 35, height: 35 }}
            />
            <div>
              <span className="font-bold">{myCommentDetails.ownersName}</span>{" "}
              <span>{myCommentDetails.postDesc}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mx-[1.21rem] lg:max-w-[900px] lg:mx-auto mt-[2rem] space-y-[2rem] comment-mobile max-h-[110vh] md:max-h-[70vh] overflow-y-auto"
        ref={divRef}
      >
        {comments?.map((comment) => (
          <Comment
            key={comment.id}
            commentPhoto={comment.commenterPhoto}
            actualComment={comment.actualComment}
            commentName={comment.commenterName}
            // commentId={comment.id}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;

const Comment = ({ commentPhoto, actualComment, commentName, commentId }) => {
  return (
    <div className="flex space-x-[15px]">
      <Avatar src={commentPhoto} sx={{ width: 35, height: 35 }} />
      <div>
        <span className="font-bold">{commentName}</span>{" "}
        <span>{actualComment}</span>
      </div>
    </div>
  );
};
