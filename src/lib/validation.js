// Matches IDs such as MAT/2022/0841, DS/2023/0198 or STAFF/ICT/117
const ID_PATTERN = /^[A-Za-z]{2,10}(\/[A-Za-z0-9]{1,10}){1,3}$/;

export const EMPTY_FORM = {
  name: "",
  personId: "",
  department: "",
  purpose: "",
  labId: "",
  keyNumber: "",
};

/** Returns an object of { field: message }. Empty object means valid. */
export function validateCheckout(values) {
  const errors = {};
  const name = values.name.trim();
  const personId = values.personId.trim();
  const department = values.department.trim();
  const purpose = values.purpose.trim();

  if (!name) errors.name = "Enter the borrower's full name.";
  else if (name.length < 3) errors.name = "Name looks too short.";
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name))
    errors.name = "Use letters only (e.g. Amina Yusuf).";

  if (!personId) errors.personId = "Enter a matric or staff ID.";
  else if (!ID_PATTERN.test(personId))
    errors.personId = "Use a format like MAT/2022/0841 or STAFF/ICT/117.";

  if (!department) errors.department = "Enter the borrower's department.";
  else if (department.length < 2) errors.department = "Department looks too short.";

  if (!purpose) errors.purpose = "State the purpose of collection.";
  else if (purpose.length < 4) errors.purpose = "Add a little more detail.";

  if (!values.labId) errors.labId = "Select a laboratory.";
  if (!values.keyNumber) errors.keyNumber = "Select an available key.";

  return errors;
}
