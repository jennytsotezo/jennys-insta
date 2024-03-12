import { Button } from "@mui/material";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
function Login() {
  const router = useRouter();
  const userInfo = useSelector((state) => state.user.userInfo);
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo, router]);

  const login = async () => {
    try {
      const userInfo = await signInWithPopup(auth, provider);
      if (userInfo) {
        dispatch({
          type: "LOGIN",
          payload: {
            userId: userInfo.user.uid,
            userName: userInfo.user.displayName,
            userEmail: userInfo.user.email,
            userPhoto: userInfo.user.photoURL,
          },
        });
        const dbRef = doc(db, "users", userInfo.user.uid);
        await setDoc(dbRef, {
          userId: userInfo.user.uid,
          userName: userInfo.user.displayName,
          userEmail: userInfo.user.email,
          userPhoto: userInfo.user.photoURL,
          timestamp: serverTimestamp(),
        });
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="lg:mt-[10vh] ml-[1rem] mt-[3rem]">
      <div>
        <h1 className="font-bold text-[18px] lg:text-[2rem] mb-[1.5rem]">
          Welcome to JoelsInsta
        </h1>
        <Button
          style={{
            backgroundColor: "#2aa6f7",
            color: "white",
            padding: "10px 1rem",
            borderRadius: "6px",
          }}
          onClick={login}
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
