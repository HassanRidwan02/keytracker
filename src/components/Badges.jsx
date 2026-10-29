import styles from "./Badges.module.css";

/** Monospace key label, e.g. AI-02 */
export function KeyBadge({ children }) {
  return <span className={styles.key}>{children}</span>;
}

const LABELS = { checkout: "Checked out", return: "Returned" };

export function StatusPill({ type }) {
  return <span className={`${styles.pill} ${styles[type]}`}>{LABELS[type]}</span>;
}
