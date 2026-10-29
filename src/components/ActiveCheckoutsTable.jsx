import Button from "./Button.jsx";
import { KeyBadge } from "./Badges.jsx";
import { labName } from "../lib/data.js";
import { formatCollected } from "../lib/format.js";
import styles from "./ActiveCheckoutsTable.module.css";

const HEADERS = ["Borrower", "ID", "Laboratory", "Key", "Collected"];

export default function ActiveCheckoutsTable({ checkouts, onReturn }) {
  if (checkouts.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>All keys are back at the ICT desk</p>
        <p className={styles.emptyText}>New checkouts will appear here.</p>
      </div>
    );
  }

  const now = new Date();

  return (
    <>
      {/* Desktop / tablet table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
              <th scope="col" className={styles.right}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {checkouts.map((r) => (
              <tr key={r.id}>
                <td>
                  <p className={styles.name}>{r.name}</p>
                  <p className={styles.sub}>{r.department}</p>
                </td>
                <td className={styles.mono}>{r.personId}</td>
                <td>{labName(r.labId)}</td>
                <td>
                  <KeyBadge>{r.keyNumber}</KeyBadge>
                </td>
                <td className={styles.time}>{formatCollected(r.collectedAt, now)}</td>
                <td className={styles.right}>
                  <Button
                    variant="secondary"
                    onClick={() => onReturn(r)}
                    aria-label={`Return key ${r.keyNumber} from ${r.name}`}
                  >
                    Return
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className={styles.cards}>
        {checkouts.map((r) => (
          <li key={r.id} className={styles.cardItem}>
            <div className={styles.cardTop}>
              <div>
                <p className={styles.name}>{r.name}</p>
                <p className={styles.sub}>{r.department}</p>
              </div>
              <KeyBadge>{r.keyNumber}</KeyBadge>
            </div>
            <dl className={styles.details}>
              <div>
                <dt>ID</dt>
                <dd className={styles.mono}>{r.personId}</dd>
              </div>
              <div>
                <dt>Laboratory</dt>
                <dd>{labName(r.labId)}</dd>
              </div>
              <div className={styles.full}>
                <dt>Collected</dt>
                <dd>{formatCollected(r.collectedAt, now)}</dd>
              </div>
            </dl>
            <Button
              variant="secondary"
              block
              onClick={() => onReturn(r)}
              aria-label={`Return key ${r.keyNumber} from ${r.name}`}
            >
              Return key
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
