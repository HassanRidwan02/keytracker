import { useId } from "react";
import Icon from "./Icon.jsx";
import styles from "./FormField.module.css";

function Wrapper({ label, error, hint, id, children }) {
  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className={`${styles.msg} ${styles.error}`}>
          <Icon name="alert" size={16} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className={styles.msg}>
          <Icon name="info" size={16} />
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, name, error, hint, ...props }) {
  const id = useId();
  return (
    <Wrapper label={label} error={error} hint={hint} id={id}>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={`${styles.control} ${error ? styles.invalid : ""}`}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({ label, name, error, hint, placeholder, options, ...props }) {
  const id = useId();
  return (
    <Wrapper label={label} error={error} hint={hint} id={id}>
      <select
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={`${styles.control} ${error ? styles.invalid : ""}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}
