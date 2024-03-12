import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  doc,
  addDoc,
  collection,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
function PostDetails() {
  const postDetail = useSelector((state) => state.user.postDetail);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [url, setUrl] = useState("");
  const [percent, setPercent] = useState(0);
  const [added, setAdded] = useState();
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (postDetail !== null || userInfo !== null) {
      const img = URL.createObjectURL(postDetail.postImage);
      setPostImage(img);
    } else {
      router.push("/login");
    }
  }, [router, postDetail, userInfo]);

  const uploadPost = () => {
    const reference = ref(storage, `postImages/${postDetail.postImage.name}`);
    const task = uploadBytesResumable(reference, postDetail.postImage);
    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(progress);
      },
      (error) => {
        if (error) {
          alert(error);
        }
      },
      async () => {
        try {
          const imageUrl = await getDownloadURL(task.snapshot.ref);
          setUrl(imageUrl);
          const postRef = collection(db, "posts");
          await addDoc(postRef, {
            postImage: imageUrl,
            postDesc: postText,
            userId: userInfo.userId,
            userName: userInfo.userName,
            userEmail: userInfo.userEmail,
            userPhoto: userInfo.userPhoto,
            numOfLikes: [],
            numOfComments: [],
            timestamp: serverTimestamp(),
          });
          setAdded(true);
        } catch (err) {
          setError(err.message);
        }
      }
    );
  };

  if (percent === 100) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }
  useEffect(() => {
    if (userInfo === null || postDetail === null) {
      router.push("/");
    }
  }, [postDetail, router, userInfo]);
  return (
    <div>
      <div
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        className="h-[45px] md:h-[60px] px-[15px]"
      >
        <div className=" flex items-center h-full justify-between lg:max-w-[940px] lg:mx-auto">
          <KeyboardArrowLeftIcon
            style={{ transform: "rotate(-90deg)" }}
            sx={{ width: 40, height: 40 }}
            onClick={() => router.push("/create/style")}
          />
          <p className="font-bold">New Post</p>
          <Button onClick={() => uploadPost()}>Share</Button>
        </div>
      </div>
      <div className="flex justify-between mt-[20px] px-[15px] lg:max-w-[940px] lg:mx-auto">
        <Avatar src={userInfo?.userPhoto} sx={{ width: 40, height: 40 }} />
        <textarea
          style={{ resize: "none" }}
          className="flex-1 mx-[15px] outline-none"
          placeholder="Write a caption..."
          onChange={(e) => setPostText(e.target.value)}
        />
        <img
          className="h-[60px] w-[80px] object-cover"
          src={postImage}
          alt=""
        />
      </div>
      {percent > 0 && (
        <div className="lg:max-w-[940px] lg:mx-auto px-[15px] lg:px-0 mt-[1rem]">
          <div className="relative h-[25px] rounded-full border">
            <div
              style={{ width: `${percent}%` }}
              className="h-full rounded-full bg-green-500 flex justify-center border"
            ></div>
            <span
              className={`absolute left-[50%] top-0 ${
                percent < 60 ? "text-black" : "text-white"
              }`}
            >
              {percent}%
            </span>
          </div>

          {percent === 100 ? (
            <p className="mt-2">Congrats, your post was successfully stored!</p>
          ) : (
            <p className="mt-2">uploading...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostDetails;
