import React, { useState } from 'react';
import { AUDIENCE_PRESETS } from '../../data/clientDatabase';

export interface TargetAudience {
  id: string;
  label: string;
  description: string;
  characteristics: string[];
  preferredChannels: string[];
  communicationStyle: string;
  customDemographics?: string[];
  customInterests?: string[];
}

interface AudienceSelectorProps {
  onAudienceSelected: (audience: TargetAudience) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  onAudienceSelected,
  onNext,
  onBack
}) => {
  const [selectionMode, setSelectionMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<TargetAudience | null>(null);
  const [customAudience, setCustomAudience] = useState<Partial<TargetAudience>>({
    label: '',
    description: '',
    characteristics: [],
    preferredChannels: [],
    communicationStyle: '',
    customDemographics: [],
    customInterests: []
  });

  const handlePresetSelect = (preset: TargetAudience) => {
    setSelectedPreset(preset);
    onAudienceSelected(preset);
  };

  const handleCustomAudienceUpdate = (updates: Partial<TargetAudience>) => {
    const updated = { ...customAudience, ...updates };
    setCustomAudience(updated);

    if (updated.label && updated.description && updated.characteristics?.length && updated.preferredChannels?.length) {
      onAudienceSelected(updated as TargetAudience);
    }
  };

  const addCharacteristic = (characteristic: string) => {
    if (!customAudience.characteristics?.includes(characteristic)) {
      handleCustomAudienceUpdate({
        characteristics: [...(customAudience.characteristics || []), characteristic]
      });
    }
  };

  const removeCharacteristic = (characteristic: string) => {
    handleCustomAudienceUpdate({
      characteristics: customAudience.characteristics?.filter(c => c !== characteristic) || []
    });
  };

  const addChannel = (channel: string) => {
    if (!customAudience.preferredChannels?.includes(channel)) {
      handleCustomAudienceUpdate({
        preferredChannels: [...(customAudience.preferredChannels || []), channel]
      });
    }
  };

  const removeChannel = (channel: string) => {
    handleCustomAudienceUpdate({
      preferredChannels: customAudience.preferredChannels?.filter(c => c !== channel) || []
    });
  };

  const isReadyToNext = selectedPreset || (customAudience.label && customAudience.description &&
    customAudience.characteristics?.length && customAudience.preferredChannels?.length);

  const channelIcons: { [key: string]: string } = {
    'Instagram': '📸',
    'Facebook': '👥',
    'WhatsApp': '💬',
    'LinkedIn': '💼',
    'Google Business': '🏢',
    'Blog': '📝',
    'Twitter': '🐦',
    'YouTube': '📺'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">2</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Select Target Audience</h2>
          <p className="text-slate-400">Choose who you want to reach with your marketing</p>
        </div>
      </div>

      {/* Selection Mode Toggle */}
      <div className="flex mb-6 bg-slate-700/50 rounded-lg p-1">
        <button
          onClick={() => setSelectionMode('preset')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            selectionMode === 'preset'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎯 Use Preset
        </button>
        <button
          onClick={() => setSelectionMode('custom')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            selectionMode === 'custom'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ✏️ Custom Audience
        </button>
      </div>

      {selectionMode === 'preset' ? (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm mb-4">
            Select a pre-configured audience segment that matches your target market:
          </p>

          {AUDIENCE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedPreset?.id === preset.id
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{preset.label}</h3>
                  <p className="text-slate-300 text-sm mb-3">{preset.description}</p>

                  <div className="mb-3">
                    <h4 className="text-slate-400 text-xs font-medium mb-2">CHARACTERISTICS:</h4>
                    <div className="flex flex-wrap gap-1">
                      {preset.characteristics.map((char) => (
                        <span key={char} className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-slate-400 text-xs font-medium mb-2">PREFERRED CHANNELS:</h4>
                    <div className="flex flex-wrap gap-1">
                      {preset.preferredChannels.map((channel) => (
                        <span key={channel} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded flex items-center">
                          <span className="mr-1">{channelIcons[channel] || '📱'}</span>
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-400 text-xs font-medium mb-1">COMMUNICATION STYLE:</h4>
                    <p className="text-slate-300 text-sm">{preset.communicationStyle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-slate-300 text-sm mb-4">
            Define a custom audience segment for your marketing campaign:
          </p>

          {/* Audience Label */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Audience Name *
            </label>
            <input
              type="text"
              value={customAudience.label || ''}
              onChange={(e) => handleCustomAudienceUpdate({ label: e.target.value })}
              placeholder="e.g., Young Urban Professionals, Expectant Mothers"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description *
            </label>
            <textarea
              value={customAudience.description || ''}
              onChange={(e) => handleCustomAudienceUpdate({ description: e.target.value })}
              placeholder="Describe this audience segment and their key characteristics..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Characteristics */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Key Characteristics *
            </label>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Add a characteristic (e.g., Health-conscious, Time-constrained)"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      addCharacteristic(value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {customAudience.characteristics?.map((char) => (
                <span key={char} className="inline-flex items-center bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
                  {char}
                  <button
                    onClick={() => removeCharacteristic(char)}
                    className="ml-2 text-emerald-400 hover:text-emerald-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Channels */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Preferred Marketing Channels *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {Object.keys(channelIcons).map((channel) => (
                <button
                  key={channel}
                  onClick={() => addChannel(channel)}
                  disabled={customAudience.preferredChannels?.includes(channel)}
                  className={`py-2 px-3 rounded-lg text-sm transition-all flex items-center justify-center ${
                    customAudience.preferredChannels?.includes(channel)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <span className="mr-1">{channelIcons[channel]}</span>
                  {channel}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {customAudience.preferredChannels?.map((channel) => (
                <span key={channel} className="inline-flex items-center bg-slate-600/50 text-slate-300 px-3 py-1 rounded-full text-sm">
                  <span className="mr-1">{channelIcons[channel] || '📱'}</span>
                  {channel}
                  <button
                    onClick={() => removeChannel(channel)}
                    className="ml-2 text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Communication Style
            </label>
            <input
              type="text"
              value={customAudience.communicationStyle || ''}
              onChange={(e) => handleCustomAudienceUpdate({ communicationStyle: e.target.value })}
              placeholder="e.g., Professional and reassuring, Modern and engaging"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-600 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {isReadyToNext && (
          <button
            onClick={onNext}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            Continue to Marketing Intent
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
