import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onFund: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onFund }) => {
  const progress = (project.raisedAmount / project.targetAmount) * 100;

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-colors flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-900/20 px-2 py-1 rounded">
            {project.category}
        </span>
        <span className="text-xs text-slate-400">Ends {project.deadline}</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
      <p className="text-slate-400 text-sm mb-4 flex-grow">{project.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-slate-300">
          <span>${project.raisedAmount.toLocaleString()} raised</span>
          <span>Goal: ${project.targetAmount.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <button 
        onClick={() => onFund(project)}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
      >
        Fund Project
      </button>
    </div>
  );
};
