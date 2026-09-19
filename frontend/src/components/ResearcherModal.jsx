import React from 'react';
import Modal from './Modal';
import SkillBadge from './SkillBadge';
import { User, Award, BookOpen, Briefcase, Plus, Check, Sparkles, Building2 } from 'lucide-react';

const ResearcherModal = ({ isOpen, onClose, researcher, onAddToTeam, isAlreadyInTeam }) => {
  if (!researcher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Researcher Profile" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header Profile Card */}
        <div className="flex items-start justify-between bg-gradient-to-r from-brand-50 via-purple-50 to-white p-5 rounded-2xl border border-brand-100">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-brand-100">
              {researcher.name ? researcher.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{researcher.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                  {researcher.role}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {researcher.affiliation}
                </span>
              </div>
              {researcher.match_score !== undefined && (
                <div className="mt-3 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-brand-200 inline-flex">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  <span className="text-xs font-medium text-slate-600">AI Match Score:</span>
                  <span className="text-sm font-extrabold text-brand-700">{researcher.match_score}%</span>
                </div>
              )}
            </div>
          </div>

          {onAddToTeam && (
            <button
              onClick={() => {
                onAddToTeam(researcher.id);
                onClose();
              }}
              disabled={isAlreadyInTeam}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isAlreadyInTeam
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20'
              }`}
            >
              {isAlreadyInTeam ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>On Team</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add to Team</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Bio */}
        {researcher.bio && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Biography</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {researcher.bio}
            </p>
          </div>
        )}

        {/* Research Interests */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Research Interests</h4>
          <div className="flex flex-wrap gap-2">
            {researcher.interests ? (
              (Array.isArray(researcher.interests)
                ? researcher.interests
                : researcher.interests.split(',')
              ).map((interest, idx) => (
                <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-3 py-1 rounded-lg font-medium">
                  {interest.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No interests specified</span>
            )}
          </div>
        </div>

        {/* Skills & Expertise */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills & Proficiency</h4>
          <div className="flex flex-wrap gap-2">
            {researcher.skills && researcher.skills.length > 0 ? (
              researcher.skills.map((skill, idx) => (
                <SkillBadge
                  key={idx}
                  name={skill.name || skill}
                  proficiency={skill.proficiency}
                  category={skill.category}
                />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed</span>
            )}
          </div>
        </div>

        {/* Experience & Areas of Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-brand-600" />
              Experience & Background
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {researcher.experience || 'Not specified'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-brand-600" />
              Areas of Expertise
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {researcher.expertise || researcher.interests || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Publications */}
        {researcher.publications && researcher.publications.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-brand-600" />
              Featured Publications
            </h4>
            <div className="space-y-2">
              {researcher.publications.map((pub, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800">{pub.title}</div>
                  <div className="text-slate-500 mt-0.5">{pub.venue} ({pub.publication_date || pub.year})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ResearcherModal;
