import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SkillBadge from '../components/SkillBadge';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Users, 
  ArrowRight,
  ArrowLeft,
  PieChart
} from 'lucide-react';
import { projectAPI } from '../services/api';

const SkillGap = () => {
  const { id } = useParams();
  const { setActiveProjectId } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (id) {
      setActiveProjectId(id);
      fetchData();
    } else {
      fetchProjects();
    }
  }, [id]);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getProjects();
      if (res.data.length > 0) {
        navigate(`/projects/${res.data[0].id}/skill-gap`, { replace: true });
      }
    } catch (err) {
      setToast({ message: 'Failed to load projects for skill gap analysis.', type: 'error' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, gapRes] = await Promise.all([
        projectAPI.getProjectById(id),
        projectAPI.getSkillGap(id),
      ]);
      setProject(projRes.data);
      setSkillGap(gapRes.data);
    } catch (err) {
      setToast({ message: 'Failed to run skill gap analysis.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project || !skillGap) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
          Running team skill gap analysis...
        </div>
      </div>
    );
  }

  const { total_required, covered_count, missing_count, coverage_percentage, gap_percentage } = skillGap;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeProjectId={id} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-flex mb-2">
                <Target className="h-3.5 w-3.5" />
                <span>Core Module 4 — Skill Gap Analyzer</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Team Skill Gap Analysis
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Project: <span className="font-bold text-slate-800">{project.title}</span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start md:self-center"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Project Workspace</span>
            </button>
          </div>

          {/* Metrics Visual Indicator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: Coverage Percentage */}
            <div className="bg-gradient-to-br from-brand-900 to-purple-900 text-white p-6 rounded-3xl shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Team Skill Coverage
              </span>
              <div className="text-4xl font-extrabold">{coverage_percentage}%</div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${coverage_percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-200">
                {covered_count} of {total_required} required project skills covered by active team members.
              </p>
            </div>

            {/* Metric 2: Skill Gap Percentage */}
            <div className="bg-gradient-to-br from-rose-900 to-amber-900 text-white p-6 rounded-3xl shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Skill Deficit Gap
              </span>
              <div className="text-4xl font-extrabold">{gap_percentage}%</div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full transition-all duration-500"
                  style={{ width: `${gap_percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-200">
                {missing_count} required skills currently unassigned in team composition.
              </p>
            </div>

            {/* Metric 3: Action Card */}
            <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  Targeted AI Recruitment
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Automatically query ResLink's AI collaborator recommendation engine focusing explicitly on missing skills.
                </p>
              </div>

              <Link
                to={`/projects/${id}/recommendations`}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-700 hover:from-brand-700 hover:to-purple-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Find Collaborators for Missing Skills</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Detailed Skill Breakdown Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Covered Skills Column */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Covered Required Skills ({covered_count})
                </h3>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  COVERED
                </span>
              </div>

              <div className="space-y-2.5">
                {skillGap.covered_skills && skillGap.covered_skills.length > 0 ? (
                  skillGap.covered_skills.map((skillName, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-900">{skillName}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        In Team
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic p-4 text-center">
                    No required skills are covered yet by current team members.
                  </div>
                )}
              </div>
            </div>

            {/* Missing Skills Column */}
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                  Missing Skill Gaps ({missing_count})
                </h3>
                <span className="text-xs font-bold bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                  MISSING GAP
                </span>
              </div>

              <div className="space-y-2.5">
                {skillGap.missing_skills && skillGap.missing_skills.length > 0 ? (
                  skillGap.missing_skills.map((skillName, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold text-rose-900">{skillName}</span>
                      </div>
                      <Link
                        to={`/projects/${id}/recommendations`}
                        className="text-[10px] font-bold text-brand-700 hover:text-brand-800 bg-white hover:bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors"
                      >
                        Recruit Talent →
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-emerald-600 font-semibold p-4 text-center bg-emerald-50 rounded-xl border border-emerald-200">
                    🎉 Outstanding! Your research team covers 100% of required project skills!
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

export default SkillGap;
