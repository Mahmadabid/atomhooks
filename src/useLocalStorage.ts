import { useState, useEffect } from 'react';

/**
 * Simple hook for localStorage management with cross-component synchronization
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // For string values, store them as raw strings without JSON serialization
      if (typeof defaultValue === 'string') {
        return item as T;
      }
      
      // For other types, use JSON parsing
      try {
        return JSON.parse(item);
      } catch {
        return defaultValue;
      }
    } catch {
      return defaultValue;
    }
  });
  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    
    if (typeof window !== 'undefined') {
      // For string values, store them as raw strings without JSON serialization
      const storageValue = typeof valueToStore === 'string' 
        ? valueToStore as string
        : JSON.stringify(valueToStore);
        
      localStorage.setItem(key, storageValue);
      // Trigger storage event for cross-component sync
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: storageValue,
        oldValue: localStorage.getItem(key),
        storageArea: localStorage
      }));
    }
  };
  const remove = () => {
    setValue(defaultValue);
    if (typeof window !== 'undefined') {
      const oldValue = localStorage.getItem(key);
      localStorage.removeItem(key);
      // Trigger storage event for cross-component sync
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: null,
        oldValue: oldValue,
        storageArea: localStorage
      }));
    }
  };

  // Listen for changes from other components
  useEffect(() => {
    if (typeof window === 'undefined') return;    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === localStorage) {
        if (!e.newValue) {
          setValue(defaultValue);
          return;
        }
        
        try {
          // For string values, use them directly without JSON parsing
          if (typeof defaultValue === 'string') {
            setValue(e.newValue as T);
          } else {
            // For other types, use JSON parsing
            setValue(JSON.parse(e.newValue));
          }
        } catch {
          setValue(defaultValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [value, setStoredValue, remove] as const;
}