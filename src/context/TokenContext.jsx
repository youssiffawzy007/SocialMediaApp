import { createContext, useState } from "react";

export const TokenContext = createContext();

export default function TokenProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("myToken"));
  function deleteToken() {
    setToken(null);
    localStorage.clear();
  }
  function saveToken(token) {
    setToken(token);
    localStorage.setItem("myToken", token);
  }
  return (
    <TokenContext.Provider value={{ token, saveToken, deleteToken }}>
      {children}
    </TokenContext.Provider>
  );
}
