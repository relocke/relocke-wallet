import ReLockeIcon from "../icons/relocke-icon.js";
import React from "react";

const LoadingIcon = ({ ...props }) => {
  return (
    <svg
      viewBox="-2 10 24 30"
      height="1em"
      width="1em"
      {...props}
      className="LoadingIcon"
    >
      <rect x="0" y="10" width="4" height="10" />
      <rect x="8" y="10" width="4" height="10" />
      <rect x="16" y="10" width="4" height="10" />
    </svg>
  );
};

export default function LoadingUI() {
  return (
    <>
      <div
      // style={{
      //   height: "100vh",
      //   textAlign: "center",
      //   paddingTop: "var(--px-128)",
      // }}
      >
        <div
        // style={{
        //   fontSize: "xx-large",
        //   alignItems: "center",
        //   display: "inline-flex",
        //   flexDirection: "column",
        //   gap: "var(--px-32)",
        // }}
        >
          <ReLockeIcon />
          <LoadingIcon />
          <p
          // style={{
          //   fontSize: "small",
          //   color: "hsla(var(--color-neutral), var(--alpha-tertiary))",
          // }}
          >
            Loading please wait.
          </p>
        </div>
      </div>
    </>
  );
}
