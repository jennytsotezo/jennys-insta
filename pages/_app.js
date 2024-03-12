import "../styles/globals.css";
import Header from "../components/Header";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
function MyApp({ Component, pageProps }) {
  const [userPresent, setUserPresent] = useState(false);
  const router = useRouter();
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserPresent(true);
        } else {
          Cookies.remove("userInfo");
        }
      }),
    []
  );
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />;
      </Provider>
    </>
  );
}

export default MyApp;
