import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card, { IconTile } from "../components/Card.jsx";
import { SelectField, TextField } from "../components/FormField.jsx";
import Icon from "../components/Icon.jsx";
import { LABS, KEYS_PER_LAB, labName } from "../lib/data.js";
import { formatMediumDate, formatTime } from "../lib/format.js";
import { useKeyStore } from "../lib/store.jsx";
import { EMPTY_FORM, validateCheckout } from "../lib/validation.js";
import styles from "./CheckOutKey.module.css";

const CHECKS = [
  "Confirm the borrower identity against their university ID.",
  "Use the label printed on the physical key.",
  "A checked-out key cannot be issued again until returned.",
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function CheckOutKey() {
  const navigate = useNavigate();
  const { availableKeysFor, checkoutKey, showNotice } = useKeyStore();
  const now = useClock();
  const formRef = useRef(null);

  const [values, setValues] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = validateCheckout(values);
  const visibleError = (field) => (submitted || touched[field] ? errors[field] : undefined);

  const availableKeys = values.labId ? availableKeysFor(values.labId) : [];

  // If the chosen key got taken in another tab, clear the selection.
  useEffect(() => {
    if (values.keyNumber && !availableKeys.some((k) => k.number === values.keyNumber)) {
      setValues((v) => ({ ...v, keyNumber: "" }));
    }
  }, [availableKeys, values.keyNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("");
    setValues((v) => (name === "labId" ? { ...v, labId: value, keyNumber: "" } : { ...v, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const found = validateCheckout(values);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    const result = checkoutKey(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    showNotice(`${result.record.keyNumber} checked out to ${result.record.name}.`);
    navigate("/");
  };

  const labOptions = LABS.map((lab) => {
    const free = availableKeysFor(lab.id).length;
    return { value: lab.id, label: `${lab.name} (${free} of ${KEYS_PER_LAB} available)` };
  });

  const keyHint =
    values.labId && availableKeys.length === 0
      ? `Every key in ${labName(values.labId)} is currently checked out.`
      : "Unavailable keys are excluded from this list.";

  const textField = (label, name, placeholder) => (
    <TextField
      label={label}
      name={name}
      placeholder={placeholder}
      autoComplete="off"
      value={values[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      error={visibleError(name)}
    />
  );

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>New collection</p>
      <h1 className={styles.title}>Check out a laboratory key</h1>
      <p className={styles.intro}>
        Record the borrower and purpose of collection. The current date and time will be added
        automatically when you submit.
      </p>

      <div className={styles.layout}>
        <Card className={styles.formCard}>
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHead}>
              <IconTile name="clipboard" tone="muted" size={48} />
              <div>
                <h2 className={styles.h2}>Borrower information</h2>
                <p className={styles.small}>All fields are required to create a checkout record.</p>
              </div>
            </div>

            <div className={styles.grid}>
              {textField("Full name", "name", "e.g. Amina Yusuf")}
              {textField("Matric / staff ID", "personId", "e.g. MAT/2022/0841")}
              {textField("Department", "department", "e.g. Computer Science")}
              {textField("Purpose of collection", "purpose", "e.g. Practical session setup")}
            </div>

            <div className={styles.keySection}>
              <h2 className={styles.h2}>Key details</h2>
              <p className={styles.small}>Choose the laboratory and physical key being collected.</p>
              <div className={`${styles.grid} ${styles.keyGrid}`}>
                <SelectField
                  label="Laboratory"
                  name="labId"
                  placeholder="Select laboratory"
                  options={labOptions}
                  value={values.labId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError("labId")}
                />
                <SelectField
                  label="Key number"
                  name="keyNumber"
                  placeholder={
                    !values.labId
                      ? "Select a laboratory first"
                      : availableKeys.length
                      ? "Select available key"
                      : "No keys available"
                  }
                  options={availableKeys.map((k) => ({ value: k.number, label: k.number }))}
                  value={values.keyNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!values.labId || availableKeys.length === 0}
                  error={visibleError("keyNumber")}
                  hint={keyHint}
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className={styles.formError}>
                <Icon name="alert" size={16} />
                {formError}
              </p>
            )}

            <div className={styles.actions}>
              <Button to="/" variant="secondary" size="lg">
                Cancel
              </Button>
              <Button type="submit" icon="key" size="lg">
                Confirm checkout
              </Button>
            </div>
          </form>
        </Card>

        <div className={styles.side}>
          <aside className={styles.stamp}>
            <IconTile name="clock" tone="inverse" size={48} />
            <h2 className={styles.stampTitle}>Automatic timestamp</h2>
            <p className={styles.stampText}>
              Collection date and time are attached to the transaction at the moment you confirm
              checkout.
            </p>
            <div className={styles.stampBox}>
              <p className={styles.stampLabel}>Recorded on submission</p>
              <p className={styles.stampValue}>
                {formatMediumDate(now)} · {formatTime(now)}
              </p>
            </div>
          </aside>

          <Card as="aside" className={styles.checks}>
            <div className={styles.checksHead}>
              <IconTile name="checkCircle" tone="success" size={40} />
              <div>
                <h2 className={styles.checksTitle}>Before you submit</h2>
                <p className={styles.tiny}>Quick checkout checks</p>
              </div>
            </div>
            <ul className={styles.checkList}>
              {CHECKS.map((c) => (
                <li key={c}>
                  <Icon name="check" size={16} className={styles.tick} strokeWidth="2.4" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
