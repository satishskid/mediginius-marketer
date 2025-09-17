import React, { useState } from 'react';
import { MarketingIntent, MARKETING_INTENTS } from '../../data/marketingIntents';
import { Tooltip } from '../ui/Tooltip';
import { ContentPreview } from './ContentPreview';
import { RetryPanel } from '../ui/RetryPanel';

interface MarketingIntentSelectorProps {
  onIntentSelected: (intent: MarketingIntent) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MarketingIntentSelector: React.FC<MarketingIntentSelectorProps> = ({
  onIntentSelected,
  onNext,
  onBack
}) => {
  const [selectedIntent, setSelectedIntent] = useState<MarketingIntent | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [showPreview, setShowPreview] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleIntentSelect = (intent: MarketingIntent) => {
    setSelectedIntent(intent);
    onIntentSelected(intent);
    setShowPreview(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      awareness: 'bg-blue-500',
      appointment: 'bg-green-500',
      education: 'bg-purple-500',
      promotion: 'bg-orange-500',
      emergency: 'bg-red-500',
      engagement: 'bg-pink-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      awareness: '🎯',
      appointment: '📅',
      education: '📚',
      promotion: '🚀',
      emergency: '🚨',
      engagement: '🤝'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const categoryTooltips = {
    awareness: 'Build brand recognition and educate your audience about healthcare services and options.',
    appointment: 'Drive direct bookings and consultations through targeted calls-to-action.',
    education: 'Share medical knowledge and establish authority in your field.',
    promotion: 'Highlight new services, special offers, or unique value propositions.',
    emergency: 'Communicate urgent updates or time-sensitive health information.',
    engagement: 'Foster community interaction and build long-term patient relationships.'
  };

  const handleRetry = () => {
    setGenerationError(null);
    if (selectedIntent) {
      onIntentSelected(selectedIntent);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">5</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Select Marketing Intent</h2>
          <p className="text-slate-400">Choose your campaign goal and communication strategy</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-slate-300 text-sm mb-4">
          Select the primary goal for your marketing campaign:
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {MARKETING_INTENTS.map((intent) => (
            <Tooltip
              key={intent.id}
              content={categoryTooltips[intent.category as keyof typeof categoryTooltips]}
              position="right"
            >
              <div
                onClick={() => {
                  handleIntentSelect(intent);
                  setShowPreview(true);
                }}
                className={`p-5 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedIntent?.id === intent.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getCategoryIcon(intent.category)}</span>
                      <div>
                        <h3 className="text-white font-medium text-lg">{intent.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryColor(intent.category)}`}></span>
                          <span className="text-xs text-slate-400 capitalize">{intent.category}</span>
                          <span className="mx-2 text-slate-600">•</span>
                          <span className={`text-xs font-medium ${getUrgencyColor(intent.urgencyLevel)}`}>
                            {intent.urgencyLevel.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-4">{intent.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-slate-400 text-xs font-medium mb-2">🎯 TARGET OUTCOMES:</h4>
                        <ul className="space-y-1">
                          {intent.targetOutcomes.map((outcome, index) => (
                            <li key={index} className="text-slate-300 text-sm flex items-center">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-slate-400 text-xs font-medium mb-2">📝 CONTENT TYPES:</h4>
                        <div className="flex flex-wrap gap-1">
                          {intent.contentTypes.map((type, index) => (
                            <span key={index} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {intent.seasonality && (
                      <div className="mt-3">
                        <h4 className="text-slate-400 text-xs font-medium mb-1">📅 TIMING:</h4>
                        <p className="text-slate-300 text-sm">{intent.seasonality}</p>
                      </div>
                    )}

                    <div className="mt-3">
                      <h4 className="text-slate-400 text-xs font-medium mb-2">⚖️ COMPLIANCE REQUIREMENTS:</h4>
                      <div className="flex flex-wrap gap-1">
                        {intent.compliance.map((requirement, index) => (
                          <span key={index} className="text-xs bg-amber-600/20 text-amber-300 px-2 py-1 rounded border border-amber-600/30">
                            {requirement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tooltip>
          ))}
        </div>

        {showPreview && selectedIntent && (
          <div className="mt-6">
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm text-slate-300">Preview Platform:</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-slate-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            
            <ContentPreview
              intent={selectedIntent}
              platform={selectedPlatform}
            />
          </div>
        )}

        {generationError && (
          <RetryPanel
            error={generationError}
            onRetry={handleRetry}
            platformName={selectedPlatform}
          />
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            disabled={!selectedIntent}
            className={`px-6 py-2 rounded-lg transition-all ${
              selectedIntent
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            Generate Content →
          </button>
        </div>
      </div>
    </div>
  );
};
