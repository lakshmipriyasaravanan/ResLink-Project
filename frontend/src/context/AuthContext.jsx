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
        fetchUserProfile(parsedUser);
      } catch (err) {
        console.error('Failed to parse saved user', err);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (currentUser = user) => {
    try {
      const res = await profileAPI.getProfile();
      setProfile(res.data);
    } catch (err) {
      // Fallback mock profile
      const fallbackProf = {
        user_id: currentUser?.id || 1,
        bio: currentUser?.email?.includes('sarah')
          ? "Postdoctoral researcher focused on Large Language Models, semantic text embeddings, and multilingual NLP evaluation."
          : "Senior faculty specializing in Machine Learning, Computer Vision, and AI-driven clinical analytics.",
        interests: currentUser?.email?.includes('sarah')
          ? ["Natural Language Processing", "Transformers", "Data Science", "Machine Learning"]
          : ["Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning"],
        experience: "12 years academic & industrial research in Deep Learning & Medical AI.",
        expertise: "Neural Network Architectures, Transformers, PyTorch, Predictive Modeling",
        skills: currentUser?.email?.includes('sarah')
          ? [
              { name: "NLP", category: "Artificial Intelligence", proficiency: 5 },
              { name: "Python", category: "Software Engineering", proficiency: 5 },
              { name: "Data Science", category: "Data Science", proficiency: 4 },
            ]
          : [
              { name: "Machine Learning", category: "Artificial Intelligence", proficiency: 5 },
              { name: "Python", category: "Software Engineering", proficiency: 5 },
              { name: "NLP", category: "Artificial Intelligence", proficiency: 4 },
              { name: "Deep Learning", category: "Artificial Intelligence", proficiency: 5 },
            ],
      };
      setProfile(fallbackProf);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('reslink_token', token);
      localStorage.setItem('reslink_user', JSON.stringify(userData));
      setUser(userData);
      await fetchUserProfile(userData);
      return userData;
    } catch (err) {
      // Fail-safe client demo fallback for Vercel live deployment
      const isSarah = email.toLowerCase().includes('sarah');
      const demoUser = {
        id: isSarah ? 2 : 1,
        name: isSarah ? 'Prof. Sarah Chen' : 'Dr. Arun Kumar',
        email: email,
        role: isSarah ? 'Research Scholar' : 'Faculty Member',
        affiliation: isSarah ? 'Stanford University' : 'IIT Madras - Department of CSE',
      };
      const token = `reslink_jwt_token_${demoUser.id}`;
      localStorage.setItem('reslink_token', token);
      localStorage.setItem('reslink_user', JSON.stringify(demoUser));
      setUser(demoUser);
      await fetchUserProfile(demoUser);
      return demoUser;
    }
  };

  const register = async (registerData) => {
    try {
      const res = await authAPI.register(registerData);
      const { token, user: userData } = res.data;
      localStorage.setItem('reslink_token', token);
      localStorage.setItem('reslink_user', JSON.stringify(userData));
      setUser(userData);
      await fetchUserProfile(userData);
      return userData;
    } catch (err) {
      const demoUser = {
        id: Date.now(),
        name: registerData.name || 'New Researcher',
        email: registerData.email,
        role: registerData.role || 'Student Researcher',
        affiliation: registerData.affiliation || 'University',
      };
      const token = `reslink_jwt_token_${demoUser.id}`;
      localStorage.setItem('reslink_token', token);
      localStorage.setItem('reslink_user', JSON.stringify(demoUser));
      setUser(demoUser);
      await fetchUserProfile(demoUser);
      return demoUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('reslink_token');
    localStorage.removeItem('reslink_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => {
    return fetchUserProfile(user);
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
