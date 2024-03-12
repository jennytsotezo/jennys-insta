import React from "react";
import Story from "./Story";

function Stories() {
  return (
    <div
      style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      className="flex sm:mx-[1rem] lg:mx-0 space-x-[1rem] md:border mb-[0.6rem] px-[1rem]  py-[0.7rem] sm:p-[1rem] overflow-x-auto max-w-[590px] story-container sm:mt-[2rem] bg-white"
    >
      <Story image="images/one.jpg" name="joel_muluh" />
      <Story image="images/two.jpg" name="john_doe" />
      <Story image="images/three.jpg" name="james_paul" />
      <Story image="images/four.jpg" name="tom_jerry" />
      <Story image="images/seven.jpg" name="Jennys_t" />
      <Story image="images/six.jpg" name="elon_musk" />
    </div>
  );
}

export default Stories;
