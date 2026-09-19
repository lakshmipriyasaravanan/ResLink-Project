import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import Modal from '../components/Modal';
import ResearcherModal from '../components/ResearcherModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  Users, 
  Sparkles, 
  Target, 
  BookOpen, 
  Plus, 
  UserPlus, 
  UserMinus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  Layers,
  FileText,
  Award,
  Database,
  Calendar
} from 'lucide-react';
import { projectAPI, profileAPI } from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const { setActiveProjectId } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  
  // Modal states for milestone creation
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Pending',
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (id) {
      setActiveProjectId(id);
      fetchProjectWorkspace();
    }
  }, [id]);

  const fetchProjectWorkspace = async () => {
    setLoading(true);
    try {
      const [projRes, gapRes, recRes] = await Promise.all([
        projectAPI.getProjectById(id),
        projectAPI.getSkillGap(id),
        projectAPI.getRecommendations(id),
      ]);
      setProject(projRes.data);
      setSkillGap(gapRes.data);
      setRecommendations(recRes.data.slice(0, 3)); // top 3 for dashboard
    } catch (err) {
      setToast({ message: 'Failed to load project details workspace.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (userId) => {
    try {
      await projectAPI.addTeamMember(id, userId, 'Collaborator');
      setToast({ message: 'Researcher added to team successfully!', type: 'success' });
      fetchProjectWorkspace();
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to add collaborator.', type: 'error' });
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      await projectAPI.removeTeamMember(id, userId);
      setToast({ message: 'Team member removed.', type: 'info' });
      fetchProjectWorkspace();
    } catch (err) {
      setToast({ message: 'Failed to remove team member.', type: 'error' });
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMilestone(id, milestoneForm);
      setIsMilestoneModalOpen(false);
      setMilestoneForm({
        title: '',
        description: '',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Pending',
      });
      setToast({ message: 'Milestone added successfully!', type: 'success' });
      fetchProjectWorkspace();
    } catch (err) {
      setToast({ message: 'Failed to add milestone.', type: 'error' });
    }
  };

  const handleToggleMilestoneStatus = async (milestone) => {
    const nextStatus = milestone.status === 'Completed' ? 'Pending' : milestone.status === 'Pending' ? 'In Progress' : 'Completed';
    try {
      await projectAPI.updateMilestone(milestone.id, { ...milestone, status: nextStatus });
      fetchProjectWorkspace();
    } catch (err) {
      setToast({ message: 'Failed to update milestone status.', type: 'error' });
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
          Loading central research workspace...
        </div>
      </div>
    );
  }

  const teamUserIds = project.team_members ? project.team_members.map(m => m.id || m.user_id) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={id} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Top Project Banner */}
          <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-brand-500/30 text-brand-200 px-3 py-1 rounded-full border border-brand-400/30">
                    {project.domain}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                    {project.status}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {project.title}
                </h1>
                <p className="text-xs md:text-sm text-purple-200 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-purple-300 pt-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-400" />
                    Timeline: {project.start_date} to {project.end_date}
                  </span>
                </div>
              </div>

              {/* Quick Hub Navigation Actions */}
              <div className="flex flex-col gap-2.5 shrink-0">
                <Link
                  to={`/projects/${id}/recommendations`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Recommendations ({recommendations.length})</span>
                </Link>

                <Link
                  to={`/projects/${id}/skill-gap`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
                >
                  <Target className="h-4 w-4" />
                  <span>Skill Gap Analysis</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Module 4: Skill Gap & Progress Overview Row */}
          {skillGap && (
            <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-800">Team Skill Coverage Metric</h3>
                  </div>
                  <div className="text-sm font-extrabold text-brand-700">
                    {skillGap.coverage_percentage}% Covered ({skillGap.gap_percentage}% Gap)
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-brand-600 transition-all duration-500"
                    style={{ width: `${skillGap.coverage_percentage}%` }}
                  />
                  <div 
                    className="h-full bg-rose-200"
                    style={{ width: `${skillGap.gap_percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Covered: {skillGap.covered_skills ? skillGap.covered_skills.join(', ') : 'None'}</span>
                  <span className="text-rose-600 font-semibold">Missing: {skillGap.missing_skills ? skillGap.missing_skills.join(', ') : 'None'}</span>
                </div>
              </div>

              <Link
                to={`/projects/${id}/skill-gap`}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shrink-0"
              >
                <span>Find Collaborators for Missing Skills</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Team, AI Collaborator Matches, Milestones */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team Members Module */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-600" />
                    Current Research Team ({project.team_members?.length || 0})
                  </h3>
                  <Link
                    to={`/projects/${id}/recommendations`}
                    className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add AI Collaborator</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.team_members?.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{member.name}</div>
                          <div className="text-[10px] text-slate-500">{member.role} • {member.affiliation}</div>
                        </div>
                      </div>

                      {project.creator_id !== member.id && (
                        <button
                          onClick={() => handleRemoveCollaborator(member.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove from team"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 3: Top AI Collaborator Recommendations Card */}
              <div className="bg-gradient-to-br from-brand-50/70 via-white to-purple-50/50 p-6 rounded-3xl border border-brand-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand-600" />
                      Top AI Recommended Collaborators
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Matched via Sentence Transformers cosine similarity
                    </p>
                  </div>
                  <Link
                    to={`/projects/${id}/recommendations`}
                    className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                  >
                    <span>View All Ranked Matches</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec) => {
                    const isInTeam = teamUserIds.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        className="bg-white p-4 rounded-2xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-brand-200 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-brand-700 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {rec.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{rec.name}</span>
                              <span className="text-[10px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                                Match: {rec.match_score}%
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">{rec.role} • {rec.affiliation}</div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {rec.matched_skills && rec.matched_skills.map((skill, sIdx) => (
                                <span key={sIdx} className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => setSelectedResearcher(rec)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleAddCollaborator(rec.id)}
                            disabled={isInTeam}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                              isInTeam
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                            }`}
                          >
                            {isInTeam ? 'On Team' : '+ Add to Team'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones Section */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    Project Milestones & Key Tasks
                  </h3>
                  <button
                    onClick={() => setIsMilestoneModalOpen(true)}
                    className="text-xs font-bold text-brand-700 hover:bg-brand-50 px-3 py-1 rounded-xl border border-brand-200 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleMilestoneStatus(milestone)}
                            className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                              milestone.status === 'Completed'
                                ? 'text-emerald-600 bg-emerald-100'
                                : 'text-slate-300 hover:text-brand-600'
                            }`}
                          >
                            <CheckCircle2 className="h-5 w-5 fill-current" />
                          </button>
                          <div>
                            <span className={`text-xs font-bold text-slate-800 ${milestone.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                              {milestone.title}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{milestone.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            Due: {milestone.due_date}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            milestone.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">
                      No milestones created yet. Click "Add Milestone" to set up your project roadmap.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Module 5 Outputs & Resources Linked to Project */}
            <div className="space-y-6">
              {/* Required Skills Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Required Skill Requirements
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.required_skills?.map((skill, idx) => (
                    <SkillBadge key={idx} name={skill.name || skill} proficiency={skill.proficiency} />
                  ))}
                </div>
              </div>

              {/* Module 5 Publications & Patents */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-brand-600" />
                    Publications & Patents
                  </h3>
                  <Link
                    to="/outputs-resources"
                    className="text-xs font-bold text-brand-700 hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-3">
                  {project.publications && project.publications.length > 0 ? (
                    project.publications.map((pub, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="font-bold text-slate-800">{pub.title}</div>
                        <div className="text-[10px] text-slate-500">{pub.venue} • DOI: {pub.doi}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">
                      No publications registered yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Module 5 Research Resources */}
              <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Database className="h-4 w-4 text-brand-600" />
                    Research Resources
                  </h3>
                  <Link
                    to="/outputs-resources"
                    className="text-xs font-bold text-brand-700 hover:underline"
                  >
                    Browse All
                  </Link>
                </div>

                <div className="space-y-2">
                  {project.resources && project.resources.length > 0 ? (
                    project.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-50 hover:bg-brand-50 rounded-xl border border-slate-100 hover:border-brand-200 text-xs flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-brand-700">{res.name}</div>
                          <div className="text-[10px] text-slate-500">{res.type}</div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-600" />
                      </a>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">
                      No research resources attached yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Researcher Modal */}
      <ResearcherModal
        isOpen={!!selectedResearcher}
        onClose={() => setSelectedResearcher(null)}
        researcher={selectedResearcher}
        onAddToTeam={handleAddCollaborator}
        isAlreadyInTeam={selectedResearcher ? teamUserIds.includes(selectedResearcher.id) : false}
      />

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title="Add Project Milestone"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Model Architecture & Data Preprocessing Pipeline"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={milestoneForm.description}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Key deliverable details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={milestoneForm.due_date}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Initial Status
              </label>
              <select
                value={milestoneForm.status}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMilestoneModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};

export default ProjectDetails;
