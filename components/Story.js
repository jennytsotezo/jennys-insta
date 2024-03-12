import React from "react";

function Story({ image, name }) {
  function truncate(name) {
    if (name.length > 10) {
      return `${name.substring(0, 10)}...`;
    }
    return name;
  }
  return (
    <div className="flex flex-col items-center">
      <img
        style={{ border: "2px solid tomato" }}
        className="w-[60px] rounded-[50%] h-[60px] object-cover p-1"
        src={image}
        alt="Story"
      />
      <span className="text-gray-500 text-[14px]">{truncate(name)}</span>
    </div>
  );
}

export default Story;
