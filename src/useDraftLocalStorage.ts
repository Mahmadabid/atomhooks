import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Hook for localStorage with draft functionality - changes are only saved when save() is called
 */
export function useDraftLocalStorage<T>(key: string, defaultValue: T) {
  // Load stored value using our main hook (for cross-component sync when saved)
  const [storedValue, setStoredValue, remove] = useLocalStorage(key, defaultValue);

  // Draft value for UI changes (not saved until save() is called)
  const [draftValue, setDraftValue] = useState(storedValue);

  // Sync draft value with stored value when it changes (e.g., from other components)
  useEffect(() => {
    setDraftValue(storedValue);
  }, [storedValue]);

  // Save draft to localStorage
  const save = () => {
    setStoredValue(draftValue);
  };

  // Reset draft to stored value
  const reset = () => {
    setDraftValue(storedValue);
  };

  // Remove value from localStorage
  const removeValue = () => {
    remove();
  };

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(draftValue) !== JSON.stringify(storedValue);

  return {
    draftValue,
    setDraftValue,
    save,
    reset,
    removeValue,
    hasChanges,
    storedValue
  } as const;
}
