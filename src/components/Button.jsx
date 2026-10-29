import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import styles from "./Button.module.css";

/** Renders a <Link> when `to` is given, otherwise a <button>. */
export default function Button({
  to,
  icon,
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  ...props
}) {
  const classes = [styles.btn, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  );
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
