import { useState } from "react";
import { parseUnits } from "ethers/lib/utils";

import { ZERO } from "constants";
import format from "utils/format";

const zero = {
  display: format(ZERO),
  raw: ZERO,
};

export default function useForm({ validate }) {
  const [values, setValues] = useState();
  const [errors, setErrors] = useState();

  const set = (name, value, type) => {
    if (!value) value = "0";

    const parsed =
      type === "display"
        ? { raw: parseUnits(value), display: value }
        : { raw: value, display: format(value) };

    const newValues = { ...values, [name]: parsed };

    const validationErrors = validate(newValues);
    if (validationErrors) setErrors(validationErrors);
    setValues(newValues);
  };

  const setValue = (name, display) => {
    set(name, display, "display");
  };

  const setRawValue = (name, raw) => {
    set(name, raw, "raw");
  };

  const register = (name) => (event) => {
    setValue(name, event.target.value);
  };

  return {
    values,
    errors: errors,
    setValue,
    setRawValue,
    register,
    zero,
  };
}
