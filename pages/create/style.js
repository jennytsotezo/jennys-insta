import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function Style() {
  const postDetail = useSelector((state) => state?.user?.postDetail);
  const [postImage, setPostImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (postDetail !== null || userInfo !== null) {
      const img = URL.createObjectURL(postDetail.postImage);
      setPostImage(img);
    } else {
      router.push("/login");
    }
  }, [postDetail, router]);
  return (
    <div>
      <div
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        className="h-[45px] md:h-[60px] px-[15px]"
      >
        <div className="flex items-center h-full justify-between lg:max-w-[940px] lg:mx-auto">
          <CloseIcon
            onClick={() => router.push("/")}
            sx={{ width: 30, height: 30 }}
          />
          <p className="font-bold">New Photo Post</p>
          <Button onClick={() => router.push("/create/details")}>Next</Button>
        </div>
      </div>
      <div className="lg:max-w-[940px] lg:mx-auto">
        <div className="mt-[2rem]">
          <img src={postImage} alt="image" />
        </div>
      </div>
    </div>
  );
}

export default Style;
