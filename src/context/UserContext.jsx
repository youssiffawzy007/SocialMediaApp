import { createContext, useState } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [UserData, setUserData] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });
  function deleteUser() {
    setUserData(null);
    localStorage.clear();
  }
  function saveUser(UserData) {
    setUserData(UserData);
    localStorage.setItem("userData", JSON.stringify(UserData));
  }
  return (
    <UserContext.Provider value={{ UserData, saveUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}
