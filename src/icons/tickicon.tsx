import React from "react";
export default function TickIcon({ title = "Tick icon", ...props }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <path
        d="M5 18.5L12.1875 25L29.25 4"
        stroke="currentColor"
        strokeWidth="2.625"
        strokeLinecap="round"
      />
    </svg>
  );
}
