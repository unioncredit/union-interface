import { useState } from "react";
import { parseUnits } from "ethers/lib/utils";

import { ZERO } from "constants";
import format from "utils/format";

const empty = {
  display: "",
  raw: ZERO,
};

const formatValue = (value) => format(value).replace(/\,/g, "");

export default function useForm(props = {}) {
  const { validate } = props;

  const [values, setValues] = useState();
  const [errors, setErrors] = useState();

  const setNumber = (name, value, type) => {
    let newValues;

    if (!value) {
      // If the value is empty set the raw value to 0 and
      // the display value to an empty string
      newValues = { ...values, [name]: { raw: ZERO, display: "" } };
    } else {
      const parsed =
        type === "display"
          ? { raw: parseUnits(value), display: value }
          : { raw: value, display: formatValue(value) };

      newValues = { ...values, [name]: parsed };
    }

    const validationErrors = validate && validate(newValues);
    setErrors((err) => ({ ...err, [name]: validationErrors }));
    setValues(newValues);
  };

  const setSimple = (name, value) => {
    const newValues = { ...values, [name]: value };
    const validationErrors = validate && validate(newValues);

    setErrors((err) => ({ ...err, [name]: validationErrors }));
    setValues(newValues);
  };

  const setValue = (name, display, type) => {
    if (type === "number") {
      setNumber(name, display, "display");
    } else {
      setSimple(name, display);
    }
  };

  const setRawValue = (name, raw) => {
    setNumber(name, raw, "raw");
  };

  const register = (name) => (event) => {
    setValue(name, event.target.value, event.target.type);
  };

  return {
    values,
    errors: errors,
    setValue,
    setRawValue,
    setSimple,
    register,
    empty,
    isErrored: Object.values(errors || {}).filter(Boolean).length > 0,
  };
}
