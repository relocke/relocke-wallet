"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";

import useKeyPress from "../../hooks/useKeypress.mjs";
import Button from "../../components/Button";
import styles from "./index.module.css";

// Define types for context value
interface ModalContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define types for ModalProvider props
interface ModalProviderProps {
  children: ReactNode;
  open?: boolean;
}

// Create Context with a default value
export const Context = createContext<ModalContextType | undefined>(undefined);

// ModalProvider component
export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  open = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open);
  const handleClose = () => setIsOpen(false);
  useKeyPress("Escape", handleClose);

  return (
    <Context.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </Context.Provider>
  );
};

// ModalButton component
interface ModalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ModalButton({
  children,
  className,
  ...props
}: ModalButtonProps) {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ModalButton must be used within a ModalProvider");
  }

  const { setIsOpen, isOpen } = context;

  return (
    <Button
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      {...props}
      className={[styles.button, className ?? ""].join(" ")}
    >
      {children}
    </Button>
  );
}

interface ModalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
}

export function ModalLink({ children, ...props }: ModalLinkProps) {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ModalLink must be used within a ModalProvider");
  }

  const { setIsOpen, isOpen } = context;

  return (
    <a onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </a>
  );
}

// Modal component
interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

export default function Modal({ children, ...props }: ModalProps) {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Modal must be used within a ModalProvider");
  }

  const { setIsOpen, isOpen } = context;

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) =>
    event.target === event.currentTarget && setIsOpen(false);

  return (
    !!isOpen &&
    createPortal(
      <div
        {...props}
        className={[styles.Modal, props?.className ?? ""].join(" ")}
        onClick={handleClickOutside}
      >
        <div className={styles.ModalContent}>{children}</div>
      </div>,
      document.body
    )
  );
}
