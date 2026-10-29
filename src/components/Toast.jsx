import { useEffect } from "react";
import Icon from "./Icon.jsx";
import { useKeyStore } from "../lib/store.jsx";
import styles from "./Toast.module.css";

export default function Toast() {
  const { notice, dismissNotice } = useKeyStore();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(dismissNotice, 4500);
    return () => clearTimeout(t);
  }, [notice, dismissNotice]);

  if (!notice) return null;

  return (
    <div className={styles.wrap}>
      <div role="status" aria-live="polite" className={styles.toast}>
        <Icon name="checkCircle" className={styles.icon} />
        <p className={styles.message}>{notice.message}</p>
        <button type="button" onClick={dismissNotice} className={styles.close} aria-label="Dismiss notification">
          <Icon name="x" size={16} />
        </button>
      </div>
    </div>
  );
}
