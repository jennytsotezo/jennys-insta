import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ExploreIcon from "@mui/icons-material/Explore";
import CloseIcon from "@mui/icons-material/Close";
import {
  SearchIcon,
  PlusCircleIcon,
  HeartIcon,
  HomeIcon,
} from "@heroicons/react/outline";

import {
  PlusCircleIcon as SolidPlusCircleIcon,
  HeartIcon as SolidHeartIcon,
  HomeIcon as SolidHomeIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import Popup from "./Popup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function Header() {
  const [selectedIcon, setSelectedIcon] = useState("Home");
  const [showPopup, setShowPopup] = useState(false);
  const [userIn, setUserIn] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const router = useRouter();
  const holdPost = (e) => {
    dispatch({
      type: "HOLD_POST",
      payload: {
        file: e.target.files[0],
      },
    });
    console.log(e.target.files[0]);
    router.push("/create/style");
  };

  useEffect(() => {
    if (userInfo) {
      setUserIn(true);
    }
  }, [userInfo]);
  return (
    <div
      style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      className="px-[1rem] h-[45px] sm:h-[60px] sticky top-0 w-full left-0 z-50 bg-white"
    >
      <div className="flex justify-between lg:justify-start h-full items-center max-w-[940px] mx-auto">
        <div className="sm:hidden">
          <CameraAltOutlinedIcon sx={{ width: 26, height: 26 }} />
        </div>

        <img
          className="h-[26px] sm:h-[30px]"
          src="images/instagram.png"
          alt="The logo"
        />
        <div className="hidden md:inline-flex flex-[0.6] flex justify-end">
          <div className="px-[10px] py-[6px] bg-[#EFEFEF] flex items-center rounded-md">
            <SearchIcon className="text-gray-400 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow w-[220px] bg-transparent ml-2 border-none outline-none"
            />
          </div>
        </div>
        <div className="flex bottom-tab space-x-[12px] sm:space-x-[17px] md:space-x-[15px] items-center flex-[0.4] justify-end">
          {selectedIcon === "Home" ? (
            <Link href="/">
              <SolidHomeIcon className="h-7" />
            </Link>
          ) : (
            <Link href="/">
              <HomeIcon
                onClick={() => setSelectedIcon("Home")}
                className="h-7"
              />
            </Link>
          )}

          <SearchIcon className="sm:hidden h-7" />
          {selectedIcon === "message" ? (
            <img
              onClick={() => setSelectedIcon("message")}
              src="/images/messageSelected.png"
              alt="Message icon"
              className="hidden h-5 sm:h-7 sm:inline-flex"
            />
          ) : (
            <img
              onClick={() => setSelectedIcon("message")}
              src="/images/message.png"
              alt="Message icon"
              className="hidden h-5 sm:h-7 sm:inline-flex"
            />
          )}

          {selectedIcon === "Plus" ? (
            <>
              <div className="hidden md:inline-flex">
                <SolidPlusCircleIcon
                  onClick={() => {
                    setShowPopup(true);
                  }}
                  className="h-7"
                />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:inline-flex">
                <PlusCircleIcon
                  onClick={() => {
                    setSelectedIcon("Plus");
                    setShowPopup(true);
                  }}
                  className="h-7"
                />
              </div>
              <label htmlFor="image">
                <div className="md:hidden">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={(e) => holdPost(e)}
                  />
                  <PlusCircleIcon className="h-7" />
                </div>
              </label>
            </>
          )}
          {selectedIcon === "Explore" ? (
            <ExploreIcon className="hidden sm:inline-flex h-7" />
          ) : (
            <ExploreOutlinedIcon
              onClick={() => setSelectedIcon("Explore")}
              className="hidden sm:inline-flex h-7"
            />
          )}
          {selectedIcon === "Heart" ? (
            <SolidHeartIcon className="h-7" />
          ) : (
            <HeartIcon
              onClick={() => setSelectedIcon("Heart")}
              className="h-7"
            />
          )}

          <div
            className="hidden sm:inline-flex"
            onClick={() => setSelectedIcon("Avatar")}
          >
            <Link href="/user">
              <Avatar
                src={userIn && userInfo?.userPhoto}
                sx={{ width: 35, height: 35 }}
              />
            </Link>
          </div>
          <div className="sm:hidden" onClick={() => setSelectedIcon("Avatar")}>
            <Link href="/user">
              <Avatar
                src={userIn && userInfo?.userPhoto}
                sx={{ width: 24, height: 24 }}
              />
            </Link>
          </div>
        </div>
        <img
          src="/images/message.png"
          alt="Message icon"
          className="h-7 sm:hidden"
        />
      </div>

      {showPopup && (
        <Popup setShowPopup={setShowPopup} overlayOpacity="0.85">
          <div className="h-[75vh] w-[35vw] bg-white rounded-lg">
            <div
              style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }}
              className="text-center text-[14px] py-[10px] border-b font-semibold"
            >
              Create new post
            </div>
            <div className="flex items-center justify-center h-full flex-col">
              <img
                className="mt-[-6rem] w-[90px] mb-[1rem]"
                src="images/addPostIcon.jpg"
                alt="Upload image logo"
              />
              <p className="text-[20px] mb-[1rem] mt-[0.2rem] font-[100]">
                Drag photos and Videos here
              </p>
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={(e) => holdPost(e)}
              />
              <label
                htmlFor="image"
                className="rounded md bg-[#0095F6] py-[5px] px-[12px] text-[12px] text-white font-semibold"
              >
                Select from computer
              </label>
            </div>
          </div>

          <CloseIcon
            style={{
              color: "white",
              pointerEvents: "none",
              position: "absolute",
              top: "4rem",
              right: "6rem",
            }}
            sx={{ width: 35, height: 35 }}
          />
        </Popup>
      )}
    </div>
  );
}

export default Header;
