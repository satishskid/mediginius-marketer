
import React from 'react';
import { Card } from './ui/Card';
import { BarChart2, CheckCircle, Clock } from 'lucide-react';

export const Planner: React.FC = () => {
  // Mock data - in a real app, this would come from tracking usage
  const usageData = [
    { name: 'Gemini Generations', used: 5, limit: 20, color: 'text-sky-400' },
    { name: 'Groq Fast Generations', used: 15, limit: 30, color: 'text-teal-400' },
    { name: 'Image Prompts', used: 2, limit: 10, color: 'text-purple-400' },
  ];

  return (
    <Card
      title={
        <>
          <BarChart2 className="mr-2 h-6 w-6 text-sky-400" /> Daily Usage Planner (Mock)
        </>
      }
      titleClassName="flex items-center"
    >
      <div className="space-y-4">
        {usageData.map((item) => (
          <div key={item.name} className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium ${item.color}`}>{item.name}</span>
              <span className="text-xs text-slate-400">
                {item.used} / {item.limit}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2.5">
              <div
                className={`bg-gradient-to-r from-sky-500 to-teal-400 h-2.5 rounded-full`}
                style={{ width: `${(item.used / item.limit) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="mt-4 text-xs text-slate-500 flex items-center">
          <Clock size={14} className="mr-1.5"/>
          Quotas are illustrative and reset daily (conceptually).
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center">
          <CheckCircle size={14} className="mr-1.5 text-green-500"/>
          Manage your usage within free tier limits.
        </div>
      </div>
    </Card>
  );
};
