import { useEffect } from "react";

function useKeyPress(targetKey, onKeyDown) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === targetKey) {
        onKeyDown();
      }
    }

    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [targetKey, onKeyDown]);
}

export default useKeyPress;
