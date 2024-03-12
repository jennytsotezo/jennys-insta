import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Head from "next/head";
import { onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";
function Home() {
  const [userIn, setUserIn] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (userInfo) {
      setUserIn(true);
    }
  }, [userInfo]);

  return (
    <>
      <Head>
        <title>{`JennysInsta  | |  ${
          userIn ? userInfo?.userName : "user"
        }`}</title>
        <link rel="icon" href="/images/instagram_icon.jpg" />
      </Head>
      <Header />
      <div className="lg:flex w-[100%] sm:max-w-[600px] w-[100%] lg:max-w-[940px] sm:mx-auto">
        <Feed />
        <Sidebar />
      </div>
    </>
  );
}

export default Home;
