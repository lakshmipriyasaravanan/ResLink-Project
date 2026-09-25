import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import ResearcherModal from '../components/ResearcherModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  UserPlus, 
  Check, 
  ArrowLeft, 
  Building2, 
  Layers, 
  BookOpen, 
  Briefcase, 
  Search,
  Zap,
  Filter,
  Clock,
  Send
} from 'lucide-react';
import { projectAPI, collaborationRequestAPI } from '../services/api';

const Recommendations = () => {
  const { id } = useParams();
  const { setActiveProjectId } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);
  const [missingSkillsOnly, setMissingSkillsOnly] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (id) {
      setActiveProjectId(id);
      fetchData();
    } else {
      fetchProjects();
    }

    const handleTeamUpdate = () => {
      if (id) fetchData();
    };
    window.addEventListener('reslink_team_updated', handleTeamUpdate);
    return () => window.removeEventListener('reslink_team_updated', handleTeamUpdate);
  }, [id, missingSkillsOnly]);

  const [availableProjects, setAvailableProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getProjects();
      setAvailableProjects(res.data);
      if (res.data.length > 0) {
        navigate(`/projects/${res.data[0].id}/recommendations`, { replace: true });
      }
    } catch (err) {
      setToast({ message: 'Failed to load projects.', type: 'error' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, recRes, reqRes] = await Promise.all([
        projectAPI.getProjectById(id),
        projectAPI.getRecommendations(id, missingSkillsOnly),
        collaborationRequestAPI.getRequests(id),
      ]);
      setProject(projRes.data);
      setRecommendations(recRes.data);
      setProjectRequests(reqRes.data || []);
    } catch (err) {
      setToast({ message: 'Failed to generate AI recommendations.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTeam = async (userId) => {
    try {
      const res = await collaborationRequestAPI.sendRequest(id, userId, 'Collaborator');
      setToast({ message: res.data?.message || 'Collaboration request sent successfully!', type: 'success' });
      fetchData();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to send collaboration request.', type: 'error' });
    }
  };

  const teamUserIds = project?.team_members ? project.team_members.map(m => m.id || m.user_id) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={id} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 inline-flex mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Core Module 3 — AI Vector Matching</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                AI Recommended Collaborators
              </h1>
              {project && (
                <p className="text-xs text-slate-500 mt-1">
                  Matching researchers for project: <span className="font-bold text-slate-800">{project.title}</span>
                </p>
              )}
            </div>

            {project && (
              <button
                onClick={() => navigate(`/projects/${id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start md:self-center"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Project Workspace</span>
              </button>
            )}
          </div>

          {/* AI Methodology Pipeline Indicator */}
          <div className="bg-gradient-to-r from-brand-900 via-purple-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Semantic Embedding Matching Architecture
                </h3>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Sentence Transformers encode project title, description, domain, and required skills into dense vector embeddings. Cosine similarity calculates exact semantic affinity against researcher profiles to deliver un-biased, ranked recommendations.
                </p>
              </div>

              {/* Filter toggle: missing skills only */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={missingSkillsOnly}
                    onChange={(e) => setMissingSkillsOnly(e.target.checked)}
                    className="h-4 w-4 rounded accent-brand-500"
                  />
                  <span>Focus strictly on Missing Skill Gaps</span>
                </label>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              Generating semantic AI vector recommendations...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3">
              <Sparkles className="h-12 w-12 text-brand-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Matching Researchers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No researchers met the current similarity threshold for this query. Try adding more skills or resetting filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((researcher) => {
                const isInTeam = teamUserIds.includes(researcher.id);
                const isPending = projectRequests.some(
                  (r) => r.receiver_id === researcher.id && r.status === 'Pending'
                );
                const score = researcher.match_score || 85;

                return (
                  <div
                    key={researcher.id}
                    className="bg-white rounded-3xl border border-brand-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
                  >
                    {/* Researcher Top Banner */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md ring-4 ring-brand-50">
                            {researcher.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                              {researcher.name}
                            </h3>
                            <div className="text-xs font-semibold text-brand-800">{researcher.role}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {researcher.affiliation}
                            </div>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="bg-gradient-to-br from-brand-50 to-purple-50 p-2.5 rounded-2xl border border-brand-200 text-center shrink-0">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Match</div>
                          <div className="text-lg font-extrabold text-brand-700">{score}%</div>
                        </div>
                      </div>

                      {/* Why Recommended Rationale */}
                      {researcher.why_recommended && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-brand-800">Why recommended: </span>
                          {researcher.why_recommended}
                        </div>
                      )}

                      {/* Matched Skills Tags */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Matched Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {researcher.matched_skills && researcher.matched_skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-lg border border-emerald-200"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* All Profile Skills */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          All Skills & Interests:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {researcher.skills && researcher.skills.map((skill, sIdx) => (
                            <SkillBadge
                              key={sIdx}
                              name={skill.name || skill}
                              proficiency={skill.proficiency}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedResearcher(researcher)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        View Full Profile
                      </button>

                      <button
                        onClick={() => handleAddToTeam(researcher.id)}
                        disabled={isInTeam || isPending}
                        className={`flex-1 py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                          isInTeam
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : isPending
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20'
                        }`}
                      >
                        {isInTeam ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span>Already on Team</span>
                          </>
                        ) : isPending ? (
                          <>
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span>Invite Sent</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Researcher Modal */}
      <ResearcherModal
        isOpen={!!selectedResearcher}
        onClose={() => setSelectedResearcher(null)}
        researcher={selectedResearcher}
        onAddToTeam={handleAddToTeam}
        isAlreadyInTeam={selectedResearcher ? teamUserIds.includes(selectedResearcher.id) : false}
        isPending={selectedResearcher ? projectRequests.some(r => r.receiver_id === selectedResearcher.id && r.status === 'Pending') : false}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};

export default Recommendations;
