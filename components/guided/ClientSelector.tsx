import React, { useState, useEffect } from 'react';
import { HealthcareClient, CLIENT_TEMPLATES, HEALTHCARE_SPECIALTIES, INDIAN_CITIES } from '../../data/clientDatabase';

interface ClientSelectorProps {
  onClientSelected: (client: HealthcareClient) => void;
  onNext: () => void;
  selectedTemplate?: HealthcareClient | null;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ onClientSelected, onNext, selectedTemplate }) => {
  const [selectionMode, setSelectionMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplateState, setSelectedTemplate] = useState<HealthcareClient | null>(selectedTemplate || null);
  const [customClient, setCustomClient] = useState<Partial<HealthcareClient>>({
    name: '',
    type: 'clinic',
    specialty: '',
    location: { city: '', state: '' },
    brandVoice: 'professional',
    services: [],
    targetDemographics: []
  });

  // Pre-populate custom client with selected template data
  useEffect(() => {
    if (selectedTemplate) {
      setSelectionMode('custom');
      setCustomClient({
        ...selectedTemplate,
        location: { ...selectedTemplate.location }
      });
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (template: HealthcareClient) => {
    setSelectedTemplate(template);
    onClientSelected(template);
  };

  const handleCustomClientUpdate = (updates: Partial<HealthcareClient>) => {
    const updated = { ...customClient, ...updates };
    setCustomClient(updated);

    if (updated.name && updated.specialty && updated.location?.city) {
      onClientSelected(updated as HealthcareClient);
    }
  };

  const isReadyToNext = selectedTemplate || (customClient.name && customClient.specialty && customClient.location?.city);

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">3</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            {selectedTemplate ? 'Customize Your Client Profile' : 'Select Your Healthcare Client'}
          </h2>
          <p className="text-slate-400">
            {selectedTemplate 
              ? `Customize ${selectedTemplate.name} to match your practice or create a new profile`
              : 'Choose from templates or create a custom profile'
            }
          </p>
        </div>
      </div>

      {/* Selection Mode Toggle */}
      <div className="flex mb-6 bg-slate-700/50 rounded-lg p-1">
        <button
          onClick={() => setSelectionMode('template')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            selectionMode === 'template'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📋 Use Template
        </button>
        <button
          onClick={() => setSelectionMode('custom')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            selectionMode === 'custom'
              ? 'bg-sky-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ✏️ Custom Client
        </button>
      </div>

      {selectionMode === 'template' ? (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm mb-4">
            Select a pre-configured healthcare client template to get started quickly:
          </p>

          {CLIENT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedTemplateState?.id === template.id
                  ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-medium">{template.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-sky-600/20 text-sky-300 px-2 py-1 rounded mr-2">
                      {template.specialty}
                    </span>
                    <span className="text-xs text-slate-400">
                      {template.location.city}, {template.location.state}
                    </span>
                  </div>
                </div>
                <span className="text-2xl">
                  {template.type === 'clinic' ? '🏥' : template.type === 'hospital' ? '🏨' : '👨‍⚕️'}
                </span>
              </div>

              <p className="text-slate-300 text-sm mb-3">
                Targets: {template.targetDemographics.slice(0, 2).join(', ')}
                {template.targetDemographics.length > 2 && '...'}
              </p>

              <div className="flex flex-wrap gap-1">
                {template.services.slice(0, 3).map((service) => (
                  <span key={service} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
                {template.services.length > 3 && (
                  <span className="text-xs text-slate-400">+{template.services.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm mb-4">
            Create a custom healthcare client profile:
          </p>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={customClient.name || ''}
              onChange={(e) => handleCustomClientUpdate({ name: e.target.value })}
              placeholder="e.g., Heart Care Clinic, Dr. Smith's Practice"
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Client Type and Specialty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Client Type
              </label>
              <select
                value={customClient.type || 'clinic'}
                onChange={(e) => handleCustomClientUpdate({ type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="clinic">Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="doctor">Individual Doctor</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="diagnostic_center">Diagnostic Center</option>
                <option value="wellness_center">Wellness Center</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Specialty *
              </label>
              <select
                value={customClient.specialty || ''}
                onChange={(e) => handleCustomClientUpdate({ specialty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select Specialty</option>
                {HEALTHCARE_SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                City *
              </label>
              <select
                value={customClient.location?.city || ''}
                onChange={(e) => handleCustomClientUpdate({
                  location: { 
                    city: e.target.value, 
                    state: customClient.location?.state || '', 
                    area: customClient.location?.area || '' 
                  }
                })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select City</option>
                {INDIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Area/Locality
              </label>
              <input
                type="text"
                value={customClient.location?.area || ''}
                onChange={(e) => handleCustomClientUpdate({
                  location: { 
                    city: customClient.location?.city || '', 
                    state: customClient.location?.state || '', 
                    area: e.target.value 
                  }
                })}
                placeholder="e.g., Bandra, Koramangala"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Brand Voice */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Brand Voice
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['professional', 'friendly', 'authoritative', 'compassionate', 'modern'].map((voice) => (
                <button
                  key={voice}
                  onClick={() => handleCustomClientUpdate({ brandVoice: voice as any })}
                  className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${
                    customClient.brandVoice === voice
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {isReadyToNext && (
        <div className="mt-8 pt-6 border-t border-slate-600">
          <button
            onClick={onNext}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            Continue to Audience Selection
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
