import { useState } from "react";
import { getStorageItem, setStorageItem } from "../utils/helpers";

/**
 * Sync a piece of state with localStorage.
 * Usage: const [theme, setTheme] = useLocalStorage("theme", "light");
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = getStorageItem<T>(key);
    return stored !== null ? stored : initialValue;
  });

  const updateValue = (newValue: T) => {
    setValue(newValue);
    setStorageItem(key, newValue);
  };

  return [value, updateValue] as const;
}
