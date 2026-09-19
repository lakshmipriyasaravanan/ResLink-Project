import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  FolderGit2, 
  PlusCircle, 
  Search, 
  Users, 
  Target, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  Filter,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { projectAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Acknowledgment Modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { setActiveProjectId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getProjects();
      setProjects(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load research projects.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProjectConfirmed = async () => {
    if (!deleteConfirmTarget) return;

    setIsDeleting(true);
    try {
      await projectAPI.deleteProject(deleteConfirmTarget.id);
      setToast({ message: `Project "${deleteConfirmTarget.title}" deleted completely.`, type: 'success' });
      setDeleteConfirmTarget(null);
      fetchProjects();
    } catch (err) {
      setToast({ message: 'Failed to delete research project.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Team Formation':
        return 'bg-brand-50 text-brand-800 border-brand-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={null} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Research Projects Workspace
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create research projects, form multidisciplinary teams, and manage milestones & outputs.
              </p>
            </div>

            <Link
              to="/projects/create"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:shadow-lg shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Research Project</span>
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-brand-100/80 shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title, domain, or skills..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Team Formation">Team Formation</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              Loading projects workspace...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3">
              <FolderGit2 className="h-12 w-12 text-brand-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No research projects match your search criteria. Create a project to start AI collaborator matching.
              </p>
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Research Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-brand-100/90 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    {/* Status & Domain Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                        {project.domain}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(project.status)}`}>
                          {project.status}
                        </span>

                        <button
                          onClick={() => setDeleteConfirmTarget(project)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Research Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Required Skills Badges */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Required Project Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.required_skills && project.required_skills.slice(0, 4).map((skill, idx) => (
                          <SkillBadge key={idx} name={skill.name || skill} proficiency={skill.proficiency} />
                        ))}
                        {project.required_skills && project.required_skills.length > 4 && (
                          <span className="text-[10px] text-slate-400 self-center font-medium">
                            +{project.required_skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Meta & Central Hub Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-brand-600" />
                        {project.team_members ? project.team_members.length : 1} Members
                      </span>
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      onClick={() => setActiveProjectId(project.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl border border-brand-200 transition-all"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Acknowledgment Modal */}
      <Modal
        isOpen={!!deleteConfirmTarget}
        onClose={() => setDeleteConfirmTarget(null)}
        title="Delete Research Project"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-900">Acknowledgement Required</h4>
              <p className="text-xs text-rose-800 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmTarget?.title}"</span>?
                This action will completely remove the project, team member assignments, milestones, and skill gap metrics from your dashboard.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setDeleteConfirmTarget(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProjectConfirmed}
              disabled={isDeleting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Confirm & Delete Project'}</span>
            </button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};

export default Projects;
