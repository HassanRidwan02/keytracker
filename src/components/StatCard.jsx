import Card, { IconTile } from "./Card.jsx";
import styles from "./StatCard.module.css";

export default function StatCard({ label, value, caption, icon, iconTone = "muted", valueTone = "default" }) {
  return (
    <Card as="article" className={styles.stat}>
      <div>
        <p className={styles.label}>{label}</p>
        <p className={`${styles.value} ${styles[valueTone]}`} aria-live="polite">
          {value}
        </p>
        <p className={styles.caption}>{caption}</p>
      </div>
      <span className={styles.icon}>
        <IconTile name={icon} tone={iconTone} />
      </span>
    </Card>
  );
}
