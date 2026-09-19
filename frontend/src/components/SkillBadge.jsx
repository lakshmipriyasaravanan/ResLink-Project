import React from 'react';
import { CheckCircle2, AlertCircle, Star } from 'lucide-react';

const SkillBadge = ({ name, proficiency, isCovered, isMissing, category }) => {
  let badgeStyle = "bg-brand-50 text-brand-800 border-brand-200";
  
  if (isCovered) {
    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (isMissing) {
    badgeStyle = "bg-rose-50 text-rose-800 border-rose-200";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${badgeStyle} shadow-2xs`}>
      {isCovered && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
      {isMissing && <AlertCircle className="h-3.5 w-3.5 text-rose-600" />}
      <span>{name}</span>
      
      {proficiency && (
        <span className="flex items-center gap-0.5 text-[10px] opacity-85 ml-1 bg-white/60 px-1.5 py-0.2 rounded font-mono">
          <Star className="h-2.5 w-2.5 fill-current text-amber-500" />
          Lvl {proficiency}
        </span>
      )}
    </div>
  );
};

export default SkillBadge;
