import React, { createContext, useState, useContext, ReactNode } from 'react';

interface IUserContext {
  user: { id: number; username: string; email: string; role: 'user' | 'admin' };
  setUser: (user: IUserContext['user']) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUserContext['user'] | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
