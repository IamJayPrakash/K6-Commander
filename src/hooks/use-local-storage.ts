
'use client';

import { useState, useCallback, useEffect } from 'react';

// A safe way to read a value from localStorage, handling potential errors and server-side rendering.
function readValueFromStorage<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // The useState initializer function will only run once on the client, which is the correct pattern.
  const [storedValue, setStoredValue] = useState<T>(() => readValueFromStorage(key, initialValue));

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
        console.warn(`Tried to set localStorage key “${key}” even though no window was found.`)
        return;
    }
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // This effect synchronizes the state if the localStorage is changed in another tab.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);


  return [storedValue, setValue];
}
