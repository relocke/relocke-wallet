import React from "react";

export default function useClickRef(onClick) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClick();
      }
    };

    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [onClick]);

  return ref;
}
