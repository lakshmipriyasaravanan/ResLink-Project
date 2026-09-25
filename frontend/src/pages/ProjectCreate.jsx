import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  Plus, 
  X, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Layers, 
  BookOpen 
} from 'lucide-react';
import { projectAPI } from '../services/api';

const ProjectCreate = () => {
  const { setActiveProjectId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: 'Artificial Intelligence',
    status: 'Team Formation',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [requiredSkills, setRequiredSkills] = useState([]);

  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 4, is_mandatory: true });
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    if (requiredSkills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      setToast({ message: 'Skill already added to project requirements.', type: 'error' });
      return;
    }
    setRequiredSkills([...requiredSkills, { ...newSkill }]);
    setNewSkill({ name: '', proficiency: 4, is_mandatory: true });
  };

  const handleRemoveSkill = (skillName) => {
    setRequiredSkills(requiredSkills.filter(s => s.name !== skillName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      setToast({ message: 'Please specify at least 1 required skill for your research project.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await projectAPI.createProject({
        ...formData,
        required_skills: requiredSkills,
      });
      const newProjectId = res.data.id;
      setActiveProjectId(newProjectId);
      setToast({ message: 'Research Project created successfully!', type: 'success' });
      setTimeout(() => {
        navigate(`/projects/${newProjectId}`);
      }, 500);
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to create research project.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={null} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </button>

            <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-full">
              Step 1 of Main AI Research Workflow
            </span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-brand-100 shadow-sm p-8 max-w-4xl mx-auto space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <FolderGit2 className="h-7 w-7 text-brand-600" />
                Create New Research Project
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Define title, scope, research domain, and required team skills to enable AI collaborator matching.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title & Domain */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-800"
                    placeholder="e.g., AI-Based Healthcare Prediction System"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Research Domain *
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Natural Language Processing">NLP & Computational Linguistics</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Cybersecurity">Cybersecurity & Cryptography</option>
                    <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                    <option value="Data Science & Healthcare">Data Science & Healthcare</option>
                    <option value="IoT & Robotics">IoT & Embedded Systems</option>
                    <option value="Blockchain Technology">Blockchain & Web3</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Project Description & Abstract *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Detail the research objectives, methodology, dataset requirements, and target outcomes..."
                />
              </div>

              {/* Status & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Project Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Team Formation">Team Formation</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Expected End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Required Project Skills Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-600" />
                    Required Team Skills & Target Proficiency Level
                  </h3>
                  <span className="text-xs text-brand-700 font-bold bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {requiredSkills.length} Skills Defined
                  </span>
                </div>

                {/* Badges List or Empty State */}
                {requiredSkills.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                    No required skills added yet. Specify required skills below to enable automated AI collaborator matching.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill, idx) => (
                      <div key={idx} className="relative group">
                        <SkillBadge name={skill.name} proficiency={skill.proficiency} />
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Skill Row */}
                <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Add required skill (e.g. Machine Learning, Cloud Computing, Data Science)"
                    className="w-full sm:flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                    className="w-full sm:w-auto p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value={1}>Proficiency 1 (Basic)</option>
                    <option value={2}>Proficiency 2</option>
                    <option value={3}>Proficiency 3 (Intermediate)</option>
                    <option value={4}>Proficiency 4 (Advanced)</option>
                    <option value={5}>Proficiency 5 (Expert)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-purple-700 hover:from-brand-700 hover:to-purple-800 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{loading ? 'Creating Project...' : 'Create Project & Run AI Match'}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};

export default ProjectCreate;
