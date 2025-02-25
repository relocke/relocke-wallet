import React from "react";
import { createElement, useState, ReactNode } from "react";
import style from "./index.module.css";

// Define the types for the InfoHover component
type InfoHoverProps = {
  children: ReactNode; // Children can be anything renderable
  message: any; // The message is a string
  position?: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  type?: string; // type is optional, default is "span"
  [key: string]: any; // Allow additional props (spread props) if needed
};

// Define the types for the Container component
type ContainerProps = {
  children: ReactNode; // Children can be anything renderable
  type?: string; // type is optional, default is "span"
  [key: string]: any; // Allow additional props (spread props)
};

function Container({ children, type = "span", ...props }: ContainerProps) {
  return createElement(type, props, children);
}

export default function InfoHover({
  children,
  message,
  position,
  type = "span",
  ...props
}: InfoHoverProps) {
  const [show, setShow] = useState(false);

  return (
    <Container
      type={type}
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={style.infoContainer}
      {...props}
    >
      {children}
      {show && message && <small className={style.container}>{message}</small>}
    </Container>
  );
}
