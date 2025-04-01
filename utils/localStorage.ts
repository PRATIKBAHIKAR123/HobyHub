export const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
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

export const setStoredPhoneNumber = (phoneNumber: string) => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem("phoneNumber", phoneNumber);
  }
}; 