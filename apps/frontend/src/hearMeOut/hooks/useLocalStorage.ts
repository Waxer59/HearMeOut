import { useCallback } from 'react';

export const useLocalStorage = () => {
  const getLocalStorageItem = useCallback((key: string) => {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return null;
      }

      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      return null;
    }
  }, []);
  const setLocalStorageItem = useCallback((key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);
  const removeLocalStorageItem = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);
  const clearLocalStorage = useCallback(() => {
    localStorage.clear();
  }, []);
  return {
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    clearLocalStorage
  };
};
