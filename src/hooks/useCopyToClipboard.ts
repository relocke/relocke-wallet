import React from "react";

// Define the return type for the hook as a tuple
type UseCopyToClipboard = [
  boolean, // copied state
  (text: string) => void // copyToClipboard function that accepts a string and returns nothing (void)
];

function useCopyToClipboard(): UseCopyToClipboard {
  const [copied, setCopied] = React.useState<boolean>(false); // `copied` is a boolean state

  const copyToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((err) => console.error("Could not copy text: ", err));
  };

  return [copied, copyToClipboard]; // Return a tuple of boolean and function
}

export default useCopyToClipboard;
