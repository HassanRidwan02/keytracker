import { IconTile } from "./Card.jsx";
import { StatusPill } from "./Badges.jsx";
import { labName } from "../lib/data.js";
import { formatEvent } from "../lib/format.js";
import styles from "./TransactionList.module.css";

export default function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p className={styles.empty}>No key movements recorded yet.</p>;
  }
  const now = new Date();

  return (
    <ul className={styles.list}>
      {transactions.map((t) => {
        const isReturn = t.type === "return";
        const { record } = t;
        return (
          <li key={t.id} className={styles.item}>
            <IconTile
              name={isReturn ? "arrowDownLeft" : "arrowUpRight"}
              tone={isReturn ? "returned" : "brand"}
              size={40}
            />
            <div className={styles.text}>
              <p className={styles.title}>
                {record.keyNumber} {isReturn ? "returned by" : "collected by"} {record.name}
              </p>
              <p className={styles.meta}>
                {labName(record.labId)} · {formatEvent(t.at, now)}
              </p>
            </div>
            <StatusPill type={t.type} />
          </li>
        );
      })}
    </ul>
  );
}
