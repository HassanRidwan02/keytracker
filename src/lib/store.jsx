import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ALL_KEYS, TOTAL_KEYS, buildSeedRecords } from "./data.js";

const STORAGE_KEY = "ict-lab-key-tracker:v1";

function isValidRecord(r) {
  return (
    r &&
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.keyNumber === "string" &&
    typeof r.labId === "string" &&
    typeof r.collectedAt === "string" &&
    (r.returnedAt === null || typeof r.returnedAt === "string")
  );
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isValidRecord)) return parsed;
    }
  } catch {
    /* corrupted or unavailable storage – fall back to sample data */
  }
  return buildSeedRecords();
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `rec-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const KeyStoreContext = createContext(null);

export function KeyStoreProvider({ children }) {
  const [records, setRecords] = useState(loadRecords);
  const [notice, setNotice] = useState(null);

  // Always holds the latest records, so back-to-back actions can't use stale data.
  const recordsRef = useRef(records);

  const commit = useCallback((next) => {
    recordsRef.current = next;
    setRecords(next);
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      /* storage full / blocked – app still works for this session */
    }
  }, [records]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.every(isValidRecord)) commit(parsed);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [commit]);

  const activeKeyNumbers = useMemo(
    () => new Set(records.filter((r) => !r.returnedAt).map((r) => r.keyNumber)),
    [records]
  );

  const activeCheckouts = useMemo(
    () =>
      records
        .filter((r) => !r.returnedAt)
        .sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt)),
    [records]
  );

  const stats = useMemo(() => {
    const checkedOut = activeCheckouts.length;
    return { total: TOTAL_KEYS, checkedOut, available: TOTAL_KEYS - checkedOut };
  }, [activeCheckouts]);

  // Newest-first list of checkout + return events.
  const transactions = useMemo(() => {
    const events = [];
    for (const r of records) {
      events.push({ id: `${r.id}-out`, type: "checkout", at: r.collectedAt, record: r });
      if (r.returnedAt)
        events.push({ id: `${r.id}-in`, type: "return", at: r.returnedAt, record: r });
    }
    return events.sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [records]);

  const availableKeysFor = useCallback(
    (labId) =>
      ALL_KEYS.filter((k) => k.labId === labId && !activeKeyNumbers.has(k.number)),
    [activeKeyNumbers]
  );

  const checkoutKey = useCallback(
    (form) => {
      const current = recordsRef.current;
      const known = ALL_KEYS.find(
        (k) => k.number === form.keyNumber && k.labId === form.labId
      );
      if (!known) return { ok: false, error: "That key does not exist in the selected lab." };
      if (current.some((r) => r.keyNumber === form.keyNumber && !r.returnedAt))
        return {
          ok: false,
          error: `${form.keyNumber} is already checked out. It can be issued again once it has been returned.`,
        };

      const record = {
        id: newId(),
        name: form.name.trim(),
        personId: form.personId.trim().toUpperCase(),
        department: form.department.trim(),
        purpose: form.purpose.trim(),
        labId: form.labId,
        keyNumber: form.keyNumber,
        collectedAt: new Date().toISOString(), // recorded automatically on submit
        returnedAt: null,
      };
      commit([record, ...current]);
      return { ok: true, record };
    },
    [commit]
  );

  const returnKey = useCallback(
    (recordId) => {
      const current = recordsRef.current;
      const target = current.find((r) => r.id === recordId && !r.returnedAt);
      if (!target) return { ok: false };
      commit(
        current.map((r) =>
          r.id === recordId ? { ...r, returnedAt: new Date().toISOString() } : r
        )
      );
      return { ok: true, record: target };
    },
    [commit]
  );

  const resetDemoData = useCallback(() => {
    commit(buildSeedRecords());
  }, [commit]);

  const showNotice = useCallback((message, tone = "success") => {
    setNotice({ id: Date.now(), message, tone });
  }, []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const value = useMemo(
    () => ({
      records,
      activeCheckouts,
      stats,
      transactions,
      availableKeysFor,
      checkoutKey,
      returnKey,
      resetDemoData,
      notice,
      showNotice,
      dismissNotice,
    }),
    [
      records,
      activeCheckouts,
      stats,
      transactions,
      availableKeysFor,
      checkoutKey,
      returnKey,
      resetDemoData,
      notice,
      showNotice,
      dismissNotice,
    ]
  );

  return <KeyStoreContext.Provider value={value}>{children}</KeyStoreContext.Provider>;
}

export function useKeyStore() {
  const ctx = useContext(KeyStoreContext);
  if (!ctx) throw new Error("useKeyStore must be used inside <KeyStoreProvider>");
  return ctx;
}
