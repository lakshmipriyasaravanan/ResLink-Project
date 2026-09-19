import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import Toast from '../components/Toast';
import { 
  UserCheck, 
  Edit3, 
  Save, 
  Plus, 
  X, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  Award, 
  Building2, 
  Cpu, 
  Layers
} from 'lucide-react';
import { profileAPI } from '../services/api';

const Profile = () => {
  const { user, profile, refreshProfile, activeProjectId } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    interests: '',
    experience: '',
    expertise: '',
    affiliation: '',
    skills: [],
  });

  const [newSkill, setNewSkill] = useState({ name: '', category: 'Artificial Intelligence', proficiency: 4 });
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests || '',
        experience: profile.experience || '',
        expertise: profile.expertise || '',
        affiliation: profile.affiliation || user?.affiliation || '',
        skills: profile.skills || [],
      });
    }
  }, [profile, user]);

  const handleSkillAdd = () => {
    if (!newSkill.name.trim()) return;
    if (formData.skills.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      setToast({ message: 'Skill already exists in your profile', type: 'error' });
      return;
    }
    setFormData({
      ...formData,
      skills: [...formData.skills, { ...newSkill }],
    });
    setNewSkill({ name: '', category: 'Artificial Intelligence', proficiency: 4 });
  };

  const handleSkillRemove = (skillName) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s.name !== skillName),
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await profileAPI.updateProfile(formData);
      await refreshProfile();
      setIsEditing(false);
      setToast({ message: 'Profile updated successfully! AI vector embeddings refreshed.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={activeProjectId} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-brand-100">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  <span>{user?.affiliation}</span>
                  <span className="text-slate-300">•</span>
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                isEditing
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Research Profile</span>
                </>
              )}
            </button>
          </div>

          {/* AI Semantic Embedding Indicator */}
          <div className="bg-gradient-to-r from-brand-950 via-purple-900 to-brand-900 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
              <Sparkles className="h-48 w-48 text-white" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Cpu className="h-6 w-6 text-purple-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                    Semantic AI Vector Representation
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Profile Embedding Pipeline Active</h3>
                <p className="text-xs text-purple-200 leading-relaxed max-w-3xl">
                  Your research profile skills, expertise text, and bio are encoded into vector embeddings using Sentence Transformers / Cosine Similarity models. This enables ResLink's AI to match you with ideal research projects based on true semantic meaning.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Bio & Experience */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-brand-600" />
                  Research Biography
                </h3>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Briefly describe your academic background, current research focus, and achievements..."
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                    {profile?.bio || 'No biography provided yet. Click "Edit Research Profile" to add your bio.'}
                  </p>
                )}
              </div>

              {/* Research Interests & Expertise */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-600" />
                  Research Interests & Domain Expertise
                </h3>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Research Interests (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Artificial Intelligence, Natural Language Processing, Machine Learning"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Areas of Expertise & Methodology
                      </label>
                      <textarea
                        rows={2}
                        value={formData.expertise}
                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Deep Learning models, Transformers, PyTorch, Large Scale NLP"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-2">Interests:</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests ? (
                          formData.interests.split(',').map((interest, idx) => (
                            <span key={idx} className="bg-brand-50 text-brand-700 border border-brand-200 text-xs px-3 py-1 rounded-lg font-medium">
                              {interest.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No research interests listed</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-1">Expertise:</span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {formData.expertise || 'Not specified'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Experience Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-600" />
                  Academic & Professional Experience
                </h3>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Describe your research experience, lab involvement, or industry projects..."
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                    {formData.experience || 'No experience details provided yet.'}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Skills & Add Skill Form */}
            <div className="space-y-6">
              {/* Skills Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-600" />
                    Technical Skills & Proficiency
                  </h3>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {formData.skills.length} Skills
                  </span>
                </div>

                {/* Skill Badges List */}
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <div key={idx} className="relative group">
                      <SkillBadge
                        name={skill.name}
                        proficiency={skill.proficiency}
                        category={skill.category}
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleSkillRemove(skill.name)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Skill Input Form */}
                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-600">Add New Technical Skill</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="e.g. Python, NLP, Cloud Computing"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="Artificial Intelligence">AI / ML</option>
                          <option value="Software Engineering">Software Eng</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Cloud & Systems">Cloud & Systems</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Domain Research">Domain Research</option>
                        </select>

                        <select
                          value={newSkill.proficiency}
                          onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value={1}>Lvl 1 - Beginner</option>
                          <option value={2}>Lvl 2 - Basic</option>
                          <option value={3}>Lvl 3 - Intermediate</option>
                          <option value={4}>Lvl 4 - Advanced</option>
                          <option value={5}>Lvl 5 - Expert</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSkillAdd}
                        type="button"
                        className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Skill to Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

export default Profile;
