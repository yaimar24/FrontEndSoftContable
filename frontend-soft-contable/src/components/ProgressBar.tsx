import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  step: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => (
  <div className="mt-8 flex items-center justify-center space-x-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= i ? 'bg-[#1e3a8a] text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
          {step > i ? <CheckCircle size={20} /> : i}
        </div>
        {i < 3 && <div className={`w-12 h-1 ${step > i ? 'bg-[#1e3a8a]' : 'bg-slate-100'}`} />}
      </div>
    ))}
  </div>
);

export default ProgressBar;
