import style from "./index.module.css";

export default function Center({ children, className = "", ...props }) {
  return (
    <div {...props} className={[style.centerContainer, className].join(" ")}>
      <div>{children}</div>
    </div>
  );
}
