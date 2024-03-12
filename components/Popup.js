import React, { useState } from "react";

function Popup({ children, setShowPopup, overlayOpacity }) {
  return (
    <div
      style={{
        backgroundColor: `rgba(0,0,0,${overlayOpacity ? overlayOpacity : 0.7})`,
      }}
      onClick={() => setShowPopup(false)}
      className={`overflow-hidden fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center
      })] z-[1000]`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[13px] popup`}
      >
        {children}
      </div>
    </div>
  );
}

export default Popup;
