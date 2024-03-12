import Cookies from "js-cookie";

const initialialState = {
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
  postDetail: null,
  commentDetails: Cookies.get("commentDetails")
    ? JSON.parse(Cookies.get("commentDetails"))
    : null,
};

export default function userReducer(state = initialialState, action) {
  switch (action.type) {
    case "LOGIN":
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "LOGOUT":
      Cookies.set("userInfo", null);
      return { ...state, userInfo: null, postDetail: null };
    case "HOLD_POST":
      return { ...state, postDetail: { postImage: action.payload.file } };
    case "HOLD_COMMENT":
      Cookies.set("commentDetails", JSON.stringify(action.payload));
      return { ...state, commentDetails: action.payload };
    default:
      return state;
  }
}
