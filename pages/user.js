import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {
  where,
  onSnapshot,
  collection,
  query,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
function User() {
  const [userIn, setUserIn] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [numOfPosts, setNumOfPosts] = useState(null);

  const getMyPosts = async () => {
    const dbRef = query(
      collection(db, "posts"),
      where("userId", "==", userInfo.userId)
    );

    onSnapshot(dbRef, (snapshot) => {
      setNumOfPosts(snapshot.docs.length);
    });
  };
  useEffect(() => {
    if (userInfo) {
      setUserIn(true);
      getMyPosts();
    }
  }, [userInfo, getMyPosts]);
  return (
    <>
      <Header />
      <div className="lg:max-w-[914px] px-[0.8rem]  md:max-w-[600px] md:mx-auto ">
        <div className="mt-[2rem] flex md:space-x-[1rem] md:mx-[3rem] flex-col md:flex-row  relative border-b pb-[1.5rem] mb-[100px]">
          <div className="md:hidden">
            <Avatar
              src={userIn ? userInfo.userPhoto : ``}
              sx={{ width: 75, height: 75 }}
            />
          </div>
          <div className="hidden md:inline-flex flex-[0.35] ">
            <Avatar
              src={userIn ? userInfo.userPhoto : ``}
              sx={{ width: 150, height: 150 }}
            />
          </div>
          <div className="flex-[0.65]">
            <div className="flex flex-col md:flex-row md:space-x-[15px] space-y-[10px] md:items-center mb-[1.5rem]">
              <p className="md:text-[30px] text-[20px] font-[100]">
                {userIn ? userInfo.userName : "No name"}
              </p>
              <div className="flex items-center space-x-[10px]">
                <Button
                  variant="contain"
                  style={{
                    backgroundColor: "white",
                    fontSize: "12px",
                    height: "30px",
                    padding: "0 15px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    textTransform: "capitalize",
                  }}
                >
                  Message
                </Button>
                <Button
                  variant="contain"
                  style={{
                    backgroundColor: "white",
                    height: "30px",
                    width: "85px",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <PersonIcon sx={{ width: 18, height: 18 }} />
                  <DoneIcon sx={{ width: 14, height: 14 }} />
                </Button>
                <Button
                  variant="contain"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid rgba(0,0,0,0.1)",
                    height: "30px",
                    width: "15px",
                  }}
                >
                  <KeyboardArrowDownIcon sx={{ width: 18, height: 18 }} />
                </Button>

                <DotsHorizontalIcon className="h-7 ml-[15px]" />
              </div>
              <div className="flex space-x-[13px] hidden">
                <Button
                  variant="contain"
                  style={{
                    backgroundColor: "white",
                    fontSize: "12px",

                    width: "100px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    textTransform: "capitalize",
                  }}
                >
                  Edit Profile
                </Button>
                <DotsHorizontalIcon className="h-7 ml-[10px]" />
              </div>
            </div>

            <div className="flex space-x-[2.5rem] px-[0.8rem] md:px-0 userFollowership-mobile text-[14px] justify-center md:justify-start">
              <FollowerDetails number={numOfPosts} genre="posts" />
              <FollowerDetails number={100} genre="followers" />
              <FollowerDetails number={250} genre="following" />
            </div>

            <div className="max-w-[230px]">
              <p className="font-semibold text-[17px] mt-[1rem] mb-[0.6]">
                {userIn ? userInfo.userName : "No name"}
              </p>
              <p>
                {
                  "There's no much to say but I just want everyone around me to be real"
                }
              </p>
            </div>
            <p className="text-[12px] text-[gray] mt-[12px]">
              Followed by <span className="font-bold">donald.trump</span> and
              <span className="font-bold"> joe_biden</span>
            </p>
          </div>
        </div>
        <div className="my-[5rem]">
          <MyPosts />
        </div>
      </div>
    </>
  );
}

export default User;

const FollowerDetails = ({ number, genre }) => {
  return (
    <p className="flex md:inline-flex flex-col md:flex-row md:space-x-[10px] items-center md:text-[16px]">
      <span className="font-semibold md:font-bold">{number}</span>
      <span className="text-gray-400 md:text-black">{genre}</span>
    </p>
  );
};

const MyPosts = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const [myPosts, setMyPosts] = useState([]);

  const getMyPosts = async () => {
    const dbRef = query(
      collection(db, "posts"),
      where("userId", "==", userInfo.userId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      setMyPosts(snapshot.docs);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (userInfo) {
      getMyPosts();
    }
  }, [getMyPosts, userInfo]);
  return (
    <div className="flex flex-wrap items-center justify-center gap-[3rem]">
      {myPosts.map((post) => (
        <Post
          key={post.id}
          postImage={post.data().postImage}
          numOfComments={post.data().numOfComments.length}
          numOfLikes={post.data().numOfLikes.length}
          postId={post.id}
        />
      ))}
    </div>
  );
};

const Post = ({ postImage, numOfComments, numOfLikes, postId }) => {
  const [openSnackbar, setOpenSnackbar] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <div className="w-[100%] mx-auto md:mx-0 md:w-[300px] relative myPost md:border">
      <img className="h-[280px] w-full object-cover" src={postImage} alt="" />

      <div className="absolute flex flex-col top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] overlay hidden">
        <div className="flex justify-end">
          <div
            className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center m-4"
            onClick={() => deletePost()}
          >
            <DeleteOutlineOutlinedIcon
              style={{ color: "red" }}
              sx={{ width: 25, height: 25 }}
            />
          </div>
        </div>
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="w-[60%] flex justify-between mx-auto">
            <p className="flex text-white font-bold space-x-[12px] items-center">
              <FavoriteIcon style={{ color: "white" }} />
              <span>{numOfLikes}</span>
            </p>
            <p className="flex text-white font-bold space-x-[12px] items-center">
              <MapsUgcIcon style={{ color: "white" }} />
              <span>{numOfComments}</span>
            </p>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
};
