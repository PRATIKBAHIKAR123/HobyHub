export const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

export const getStored = (key: string) => {
  const storage = getLocalStorage();
  return storage ? storage.getItem(key) : "";
};

export const setStored = (key: string,data: {}) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(key, JSON.stringify(data));
  }
};

export const removeStored = (key: string) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem(key);
  }
};

export const getStoredToken = () => {
  const storage = getLocalStorage();
  return storage ? storage.getItem("token") : "";
};

export const setStoredToken = (token: string) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem("token", token);
  }
};

export const removeStoredToken = () => {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem("token");
  }
};

export const setStoredPhoneNumber = (phoneNumber: string) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem("phoneNumber", phoneNumber);
  }
}; 