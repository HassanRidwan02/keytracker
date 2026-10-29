import Icon from "./Icon.jsx";
import styles from "./Card.module.css";

export default function Card({ as: Tag = "section", className = "", children, ...props }) {
  return (
    <Tag className={`${styles.card} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/** Rounded square with an icon inside. `size` is in pixels. */
export function IconTile({ name, tone = "brand", size = 44 }) {
  return (
    <span className={`${styles.tile} ${styles[tone]}`} style={{ width: size, height: size }}>
      <Icon name={name} size={20} />
    </span>
  );
}
