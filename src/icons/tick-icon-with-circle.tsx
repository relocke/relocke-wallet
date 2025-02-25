import React from "react";

export default function TickIconWithCircle({ title = "Tick Icon", ...props }) {
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
        d="M27.5155 12.5155C28.2825 15.0504 28.1917 17.7677 27.2571 20.2457C26.3225 22.7238 24.5963 24.8242 22.3463 26.2213C20.0963 27.6183 17.4481 28.2338 14.8126 27.9724C12.1771 27.7111 9.70144 26.5873 7.76966 24.7755C5.83788 22.9638 4.55792 20.5652 4.12828 17.9518C3.69864 15.3384 4.14334 12.6563 5.3934 10.3214C6.64347 7.98654 8.62905 6.12939 11.0422 5.03799C13.4553 3.9466 16.1611 3.68197 18.74 4.28513"
        stroke="currentColor"
        strokeWidth="2.26966"
      />
      <path
        d="M11.2137 14.3342L15.753 18.5898L27.436 3.88811"
        stroke="currentColor"
        strokeWidth="2.26966"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
