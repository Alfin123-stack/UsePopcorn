import { useState, useEffect } from "react";

export function useLocalStorage(initilaValue, keyLocalStorage) {
  const [value, setValue] = useState(function () {
    return JSON.parse(localStorage.getItem(keyLocalStorage)) || initilaValue;
  });
  useEffect(
    function () {
      localStorage.setItem(keyLocalStorage, JSON.stringify(value));
    },
    [value, keyLocalStorage]
  );

  return [value, setValue];
}
