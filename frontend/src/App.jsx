import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetails from './pages/ProjectDetails';
import Recommendations from './pages/Recommendations';
import SkillGap from './pages/SkillGap';
import OutputsResources from './pages/OutputsResources';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-medium">
        Loading ResLink Platform...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Core Module 1: User & Profile Management */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Core Module 2: Research Project Management */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <ProjectCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      {/* Core Module 3: AI Collaborator Recommendation */}
      <Route
        path="/projects/:id/recommendations"
        element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        }
      />

      {/* Core Module 4: Skill Gap Analysis */}
      <Route
        path="/projects/:id/skill-gap"
        element={
          <ProtectedRoute>
            <SkillGap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <SkillGap />
          </ProtectedRoute>
        }
      />

      {/* Core Module 5: Research Output & Resource Management */}
      <Route
        path="/outputs-resources"
        element={
          <ProtectedRoute>
            <OutputsResources />
          </ProtectedRoute>
        }
      />

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
