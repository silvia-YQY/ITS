import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface IUserContext {
  user: { id: number; username: string; email: string; role: 'user' | 'admin' };
  setUser: (user: IUserContext['user']) => void;
  fetchUserData: () => Promise<void>;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUserContext['user'] | null>(null);

  const fetchUserData = async () => {
    try {
      const res = JSON.parse(localStorage.getItem('user'));
      setUser(res); // Set the user data in context
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  const updateUser = (user: UserContext['user']) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };
  // Fetch user data after the component mounts
  useEffect(() => {
    if (Cookies.get('token')) fetchUserData();
  }, []);

  return <UserContext.Provider value={{ user, setUser: updateUser, fetchUserData }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
