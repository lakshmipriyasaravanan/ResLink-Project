import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('reslink_token');
    const savedUser = localStorage.getItem('reslink_user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        fetchUserProfile();
      } catch (err) {
        console.error('Failed to parse saved user', err);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await profileAPI.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('reslink_token', token);
    localStorage.setItem('reslink_user', JSON.stringify(userData));
    setUser(userData);
    await fetchUserProfile();
    return userData;
  };

  const register = async (registerData) => {
    const res = await authAPI.register(registerData);
    const { token, user: userData } = res.data;
    localStorage.setItem('reslink_token', token);
    localStorage.setItem('reslink_user', JSON.stringify(userData));
    setUser(userData);
    await fetchUserProfile();
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('reslink_token');
    localStorage.removeItem('reslink_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => {
    return fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        activeProjectId,
        setActiveProjectId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
