import React, { createContext, useContext, useState } from 'react';
import User from '../../models/User';

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, _setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (newUser: User | null) => {
    _setUser(newUser);
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
