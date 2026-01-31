import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * Safely parse JSON string, returning null if parsing fails
 */
function parseJSON<T>(value: string | null): T | null {
  try {
    return value === 'undefined' ? null : JSON.parse(value ?? 'null');
  } catch {
    console.warn('Failed to parse JSON from localStorage');
    return null;
  }
}

/**
 * Hook for persistent state management with localStorage
 * Includes cross-tab synchronization and error handling
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue]
 *
 * @example
 * const [cart, setCart, removeCart] = useLocalStorage('shopping-cart', []);
 *
 * // Update cart
 * setCart([...cart, newItem]);
 *
 * // Clear cart
 * removeCart();
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  // Get from localStorage or use initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? parseJSON<T>(item) ?? initialValue : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn('localStorage is not available in this environment');
        return;
      }

      try {
        // Allow value to be a function so we have same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // Save state
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab communication
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, newValue }
          })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available in this environment');
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      window.dispatchEvent(
        new CustomEvent('local-storage', {
          detail: { key, newValue: initialValue }
        })
      );
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ((e as StorageEvent).key && (e as StorageEvent).key !== key) {
        return;
      }

      setStoredValue(readValue());
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events from same tab
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}
