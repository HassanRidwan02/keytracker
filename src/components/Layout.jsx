import { NavLink, Outlet, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import Icon from "./Icon.jsx";
import Toast from "./Toast.jsx";
import { useKeyStore } from "../lib/store.jsx";
import styles from "./Layout.module.css";

const navClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`;

export default function Layout() {
  const { pathname } = useLocation();
  const onCheckout = pathname.startsWith("/checkout");
  const { resetDemoData, showNotice } = useKeyStore();

  const handleReset = () => {
    if (window.confirm("Reset all records back to the original sample data?")) {
      resetDemoData();
      showNotice("Sample data restored.");
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={`container ${styles.bar}`}>
          <NavLink to="/" className={styles.brand} aria-label="Lab Key Tracker home">
            <span className={styles.logo}>
              <Icon name="key" />
            </span>
            <span className={styles.brandText}>
              <span className={styles.brandTitle}>Crescent University ICT Services</span>
              <span className={styles.brandSub}>Labs Key Tracker</span>
            </span>
          </NavLink>

          <nav aria-label="Main" className={styles.nav}>
            <NavLink to="/" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/checkout" className={navClass}>
              Check Out Key
            </NavLink>
          </nav>

          {onCheckout ? (
            <Button to="/" variant="secondary" icon="arrowLeft" aria-label="Back to dashboard">
              <span className={styles.hideSm}>Back to dashboard</span>
              <span className={styles.showSm}>Back</span>
            </Button>
          ) : (
            <Button to="/checkout" icon="plus" aria-label="Check out key">
              <span className={styles.hideSm}>Check out key</span>
              <span className={styles.showSm}>Check out</span>
            </Button>
          )}
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <Outlet />
      </main>

      <footer className={`container ${styles.footer}`}>
        <div className={styles.footerInner}>
          <span>Records are saved in this browser.</span>
          <button type="button" onClick={handleReset} className={styles.reset}>
            Reset sample data
          </button>
        </div>
      </footer>

      <Toast />
    </div>
  );
}
