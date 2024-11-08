import { useState } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import { ZERO } from "constants";
import format from "utils/format";
import { toFixed } from "utils/numbers";
import { useToken } from "hooks/useToken";

const empty = {
  display: "",
  raw: ZERO,
  formatted: "",
};

const formatValue = (value, token, rounded) => format(value, token, 2, rounded).replace(/,/g, "");

export default function useForm(props = {}) {
  const { validate } = props;
  const { token, unit } = useToken();

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const setNumber = (name, value, type, rounded) => {
    let newValues;

    if (!value) {
      // If the value is empty set the raw value to 0 and
      // the display value to an empty string
      newValues = {
        ...values,
        [name]: { raw: ZERO, display: "", formatted: "" },
      };
    } else {
      const parsed =
        type === "display"
          ? {
              raw: parseUnits(toFixed(value), unit),
              display: value,
              formatted: value,
            }
          : {
              raw: value,
              display: formatValue(value, token, rounded),
              formatted: formatUnits(value, unit),
            };

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

  const setValue = (name, display, type, rounded = true) => {
    if (type === "number") {
      setNumber(name, display, "display", rounded);
    } else {
      setSimple(name, display);
    }
  };

  const setRawValue = (name, raw, rounded = true) => {
    setNumber(name, raw, "raw", rounded);
  };

  const register = (name) => (event) => {
    setValue(name, event.target.value, event.target.type);
  };

  const reset = () => {
    setValues({});
    setErrors({});
  };

  return {
    values,
    errors: errors,
    setValue,
    setRawValue,
    setSimple,
    register,
    reset,
    empty,
    isErrored: Object.values(errors || {}).filter(Boolean).length > 0,
  };
}
