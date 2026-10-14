import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { emailNotifications: true, autoRefresh: false };
  });

  const login = (email, password) => {
    const userData = { name: 'Admin User', email: email, role: 'Order Manager' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (name) => {
    const updated = { ...user, name };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const updateSettings = (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    localStorage.setItem('settings', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, settings, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);