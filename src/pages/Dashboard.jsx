import ActiveCheckoutsTable from "../components/ActiveCheckoutsTable.jsx";
import Button from "../components/Button.jsx";
import Card, { IconTile } from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";
import TransactionList from "../components/TransactionList.jsx";
import { LABS } from "../lib/data.js";
import { formatLongDate } from "../lib/format.js";
import { useKeyStore } from "../lib/store.jsx";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { stats, activeCheckouts, transactions, returnKey, showNotice } = useKeyStore();

  const handleReturn = (record) => {
    const result = returnKey(record.id);
    if (result.ok) showNotice(`${record.keyNumber} returned by ${record.name}. It is available again.`);
  };

  return (
    <div className={styles.page}>
      {/* Page heading */}
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>ICT Lab Operations</p>
          <h1 className={styles.title}>Key circulation at a glance</h1>
          <p className={styles.intro}>
            Track availability, manage returns, and keep a reliable record of every laboratory key
            collection.
          </p>
        </div>
        <Card as="div" className={styles.dateCard}>
          <p className={styles.dateLabel}>Today's date</p>
          <p className={styles.dateValue}>{formatLongDate()}</p>
        </Card>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <StatCard
          label="Total keys"
          value={stats.total}
          caption={`Across ${LABS.length} ICT laboratories`}
          icon="key"
        />
        <StatCard
          label="Available now"
          value={stats.available}
          valueTone="success"
          caption="Ready for collection"
          icon="checkCircle"
          iconTone="success"
        />
        <StatCard
          label="Checked out"
          value={stats.checkedOut}
          valueTone="brand"
          caption={stats.checkedOut ? "Require a return action" : "Nothing outstanding"}
          icon="arrowUpRight"
          iconTone="brand"
        />
      </div>

      {/* Active checkouts */}
      <Card aria-labelledby="active-heading" className={styles.active}>
        <div className={styles.sectionHead}>
          <div>
            <h2 id="active-heading" className={styles.h2}>Active checkouts</h2>
            <p className={styles.sub}>Keys currently held by students and staff.</p>
          </div>
          <Button to="/checkout" icon="plus" size="lg">
            Record checkout
          </Button>
        </div>
        <ActiveCheckoutsTable checkouts={activeCheckouts} onReturn={handleReturn} />
      </Card>

      {/* Recent transactions + call to action */}
      <div className={styles.bottom}>
        <Card aria-labelledby="recent-heading" className={styles.recent}>
          <h2 id="recent-heading" className={styles.h2}>Recent transactions</h2>
          <p className={`${styles.sub} ${styles.recentSub}`}>Latest key movements recorded by ICT staff.</p>
          <TransactionList transactions={transactions.slice(0, 5)} />
        </Card>

        <aside className={styles.cta}>
          <IconTile name="shield" tone="inverse" size={48} />
          <h2 className={styles.ctaTitle}>Keep the register accurate</h2>
          <p className={styles.ctaText}>
            Confirm each return as soon as a key reaches the ICT desk so colleagues can see live
            availability.
          </p>
          <div className={styles.ctaAction}>
            <Button to="/checkout" variant="inverse" size="lg" block>
              New checkout
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
