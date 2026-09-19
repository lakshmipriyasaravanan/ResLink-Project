import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FolderGit2, 
  UserCheck, 
  Sparkles, 
  Target, 
  BookOpen, 
  PlusCircle,
  FileText
} from 'lucide-react';

const Sidebar = ({ activeProjectId }) => {
  const navItems = [
    {
      name: 'Research Projects',
      path: '/projects',
      icon: FolderGit2,
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: UserCheck,
    },
    {
      name: 'AI Collaborators',
      path: activeProjectId ? `/projects/${activeProjectId}/recommendations` : '/recommendations',
      icon: Sparkles,
      badge: 'AI Match',
    },
    {
      name: 'Skill Gap Analysis',
      path: activeProjectId ? `/projects/${activeProjectId}/skill-gap` : '/skill-gap',
      icon: Target,
    },
    {
      name: 'Outputs & Resources',
      path: '/outputs-resources',
      icon: BookOpen,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-brand-100 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-xs">
      <div className="space-y-6">
        <div>
          <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Core Modules
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs border border-brand-100/80'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 stroke-[2]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-brand-600 to-purple-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Action Box */}
        <div className="pt-4 border-t border-slate-100">
          <NavLink
            to="/projects/create"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-md shadow-brand-500/20 transition-all hover:shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Research Project</span>
          </NavLink>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-gradient-to-br from-brand-50 to-purple-50/50 p-3.5 rounded-xl border border-brand-100">
        <div className="flex items-center gap-2 text-brand-800 font-bold text-xs mb-1">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <span>Semantic AI Matching</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Matches researcher profiles & project skill requirements using cosine similarity vector embeddings.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
