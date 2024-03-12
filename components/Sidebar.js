import { Avatar } from "@mui/material";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
function Sidebar() {
  const [userIn, setUserIn] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUserIn(true);
    }
  }, [userInfo]);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });

      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const switchAccount = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userData = await signInWithPopup(auth, provider);
      if (userData) {
        dispatch({
          type: "LOGIN",
          payload: {
            userId: userData.user.uid,
            userName: userData.user.displayName,
            userEmail: userData.user.email,
            userPhoto: userData.user.photoURL,
          },
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hidden relative lg:block flex-grow mt-[3.5rem] ml-[2rem]">
      <div className="sticky top-[5.8rem]">
        <div className="flex justify-between items-center">
          <Avatar
            onClick={() => signUserOut()}
            src={userInfo?.userPhoto}
            sx={{ width: 60, height: 60 }}
          />
          <div className="ml-[15px] flex-1 ">
            <strong>{userIn ? userInfo?.userName : "No name"}</strong>
            <span className="block text-gray-400">
              {userIn ? userInfo?.userName : "No name"}
            </span>
          </div>

          <span
            className="text-[#2AA6F7] font-semibold cursor-pointer"
            onClick={() => switchAccount()}
          >
            Switch
          </span>
        </div>
        <div className="my-[2rem] flex justify-between">
          <p>Suggested For You</p>
          <span>See All</span>
        </div>
        <div className="space-y-[8px]">
          <Suggestion name="johndoe" image="/images/one.jpg" />
          <Suggestion name="jane_doe" image="/images/two.jpg" />
          <Suggestion name="peter_parker" image="/images/three.jpg" />
          <Suggestion name="james_paul" image="/images/four.jpg" />
          <Suggestion name="leonardsnart" image="/images/five.jpg" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

const Suggestion = ({ name, image }) => {
  return (
    <div className="flex justify-between items-center text-[14px]">
      <img className="rounded-full w-[35px] h-[35px] " src={image} alt="" />
      <div className="ml-[15px] flex-1 ">
        <strong>{name}</strong>
        <span className="block text-gray-400">Follows you</span>
      </div>

      <span className="text-[#2AA6F7] font-semibold cursor-pointer">
        Follow
      </span>
    </div>
  );
};
