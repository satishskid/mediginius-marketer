import React from 'react';

interface TemplateEducationProps {
  onStartWithTemplate: () => void;
  onCreateCustom: () => void;
}

export const TemplateEducation: React.FC<TemplateEducationProps> = ({
  onStartWithTemplate,
  onCreateCustom
}) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">1</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Choose Your Starting Point</h2>
          <p className="text-slate-400">Select how you'd like to begin creating your healthcare marketing campaign</p>
        </div>
      </div>

      {/* What are Templates Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          What are Templates?
        </h3>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Templates are pre-configured healthcare client profiles that include everything you need to create
            effective marketing campaigns. Each template comes with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <span className="text-sky-400 mr-2 mt-0.5">•</span>
              <div>
                <span className="text-slate-200 font-medium">Complete Client Profile</span>
                <p className="text-slate-400 text-xs">Name, specialty, location, and brand voice</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sky-400 mr-2 mt-0.5">•</span>
              <div>
                <span className="text-slate-200 font-medium">Target Demographics</span>
                <p className="text-slate-400 text-xs">Who your ideal patients are</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sky-400 mr-2 mt-0.5">•</span>
              <div>
                <span className="text-slate-200 font-medium">Services & USP</span>
                <p className="text-slate-400 text-xs">What you offer and what makes you unique</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-sky-400 mr-2 mt-0.5">•</span>
              <div>
                <span className="text-slate-200 font-medium">Marketing Advantages</span>
                <p className="text-slate-400 text-xs">Competitive edges for your campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How Templates Help Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="text-2xl mr-2">🚀</span>
          How Templates Help You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="text-emerald-400 text-2xl mb-2">⚡</div>
            <h4 className="text-emerald-300 font-medium mb-2">Save Time</h4>
            <p className="text-slate-300 text-sm">
              Skip the setup process and start creating content immediately with professionally crafted profiles.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-blue-400 text-2xl mb-2">🎯</div>
            <h4 className="text-blue-300 font-medium mb-2">Target Right Audience</h4>
            <p className="text-slate-300 text-sm">
              Pre-configured demographics and audience insights ensure your marketing reaches the right patients.
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="text-purple-400 text-2xl mb-2">📈</div>
            <h4 className="text-purple-300 font-medium mb-2">Better Results</h4>
            <p className="text-slate-300 text-sm">
              Templates include proven marketing strategies and competitive advantages for higher engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Template Categories Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="text-2xl mr-2">🏥</span>
          Available Template Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Cardiology', icon: '❤️', count: '1 template' },
            { name: 'Dental', icon: '🦷', count: '1 template' },
            { name: 'IVF/Fertility', icon: '👶', count: '1 template' },
            { name: 'Orthopedics', icon: '🦴', count: '1 template' },
            { name: 'Pediatrics', icon: '👶', count: '1 template' },
            { name: 'Ophthalmology', icon: '👁️', count: '1 template' },
            { name: 'Dermatology', icon: '✨', count: '1 template' },
            { name: 'Gynecology', icon: '🌸', count: '1 template' },
            { name: 'Neurology', icon: '🧠', count: '1 template' },
            { name: 'Multi-Specialty', icon: '🏥', count: '1 template' },
            { name: 'Psychiatry', icon: '🧠', count: '1 template' },
            { name: 'Physiotherapy', icon: '💪', count: '1 template' }
          ].map((category) => (
            <div key={category.name} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 text-center">
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-slate-200 text-sm font-medium">{category.name}</div>
              <div className="text-slate-400 text-xs">{category.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStartWithTemplate}
          className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <span className="text-xl mr-2">📋</span>
          Browse Templates
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onCreateCustom}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center border border-slate-600"
        >
          <span className="text-xl mr-2">✏️</span>
          Create Custom Profile
        </button>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 bg-sky-500/10 border border-sky-500/20 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-sky-400 text-xl mr-3">💡</span>
          <div>
            <h4 className="text-sky-300 font-medium mb-1">Pro Tip</h4>
            <p className="text-slate-300 text-sm">
              Start with a template that matches your specialty - you can always customize the details later
              to perfectly fit your practice's unique needs and branding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
