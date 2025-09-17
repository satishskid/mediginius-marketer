import React, { useState } from 'react';
import { HealthcareClient, CLIENT_TEMPLATES } from '../../data/clientDatabase';

interface TemplateSelectorProps {
  onTemplateSelected: (template: HealthcareClient) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelected,
  onBack,
  onNext
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<HealthcareClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Specialties', icon: '🏥' },
    { id: 'Cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'Dental', name: 'Dental', icon: '🦷' },
    { id: 'IVF/Fertility', name: 'IVF/Fertility', icon: '👶' },
    { id: 'Orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'Pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'Ophthalmology', name: 'Eye Care', icon: '👁️' },
    { id: 'Dermatology', name: 'Dermatology', icon: '✨' },
    { id: 'Gynecology', name: 'Gynecology', icon: '🌸' },
    { id: 'Neurology', name: 'Neurology', icon: '🧠' },
    { id: 'Psychiatry', name: 'Psychiatry', icon: '🧠' },
    { id: 'Physiotherapy', name: 'Physiotherapy', icon: '💪' },
    { id: 'Multi-Specialty', name: 'Multi-Specialty', icon: '🏥' }
  ];

  const filteredTemplates = CLIENT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.specialty === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: HealthcareClient) => {
    setSelectedTemplate(template);
    onTemplateSelected(template);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      clinic: '🏥',
      hospital: '🏨',
      doctor: '👨‍⚕️',
      pharmacy: '💊',
      diagnostic_center: '🔬',
      wellness_center: '🌿'
    };
    return icons[type as keyof typeof icons] || '🏥';
  };

  const getBrandVoiceColor = (voice: string) => {
    const colors = {
      professional: 'bg-blue-500/20 text-blue-300',
      friendly: 'bg-green-500/20 text-green-300',
      authoritative: 'bg-purple-500/20 text-purple-300',
      compassionate: 'bg-pink-500/20 text-pink-300',
      modern: 'bg-cyan-500/20 text-cyan-300'
    };
    return colors[voice as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold">1</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Select a Template</h2>
            <p className="text-slate-400">Choose from {CLIENT_TEMPLATES.length} professionally crafted healthcare templates</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates by name, specialty, or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 pl-10"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                selectedCategory === category.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedTemplate?.id === template.id
                ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/20'
                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg mb-1">{template.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-xs bg-sky-600/20 text-sky-300 px-2 py-1 rounded mr-2">
                    {template.specialty}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${getBrandVoiceColor(template.brandVoice)}`}>
                    {template.brandVoice}
                  </span>
                </div>
                <div className="flex items-center text-slate-400 text-sm">
                  <span className="mr-1">{getTypeIcon(template.type)}</span>
                  {template.location.city}, {template.location.state}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-slate-300 text-sm font-medium mb-2">Target Demographics:</h4>
              <div className="flex flex-wrap gap-1">
                {template.targetDemographics.slice(0, 2).map((demo) => (
                  <span key={demo} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                    {demo}
                  </span>
                ))}
                {template.targetDemographics.length > 2 && (
                  <span className="text-xs text-slate-400">+{template.targetDemographics.length - 2} more</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-slate-300 text-sm font-medium mb-2">Key Services:</h4>
              <div className="flex flex-wrap gap-1">
                {template.services.slice(0, 3).map((service) => (
                  <span key={service} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
                {template.services.length > 3 && (
                  <span className="text-xs text-slate-400">+{template.services.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-600 pt-3">
              <h4 className="text-slate-300 text-sm font-medium mb-2">Unique Selling Points:</h4>
              <ul className="text-slate-400 text-xs space-y-1">
                {template.uniqueSellingPoints.slice(0, 2).map((usp) => (
                  <li key={usp} className="flex items-start">
                    <span className="text-sky-400 mr-1">•</span>
                    {usp}
                  </li>
                ))}
                {template.uniqueSellingPoints.length > 2 && (
                  <li className="text-slate-500">+{template.uniqueSellingPoints.length - 2} more advantages</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <div className="text-slate-400 text-4xl mb-4">🔍</div>
          <h3 className="text-slate-300 text-lg font-medium mb-2">No templates found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Selected Template Summary */}
      {selectedTemplate && (
        <div className="mt-6 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <span className="text-emerald-400 mr-2">✓</span>
            Selected: {selectedTemplate.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Specialty:</span>
              <span className="text-slate-200 ml-2">{selectedTemplate.specialty}</span>
            </div>
            <div>
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-200 ml-2">{selectedTemplate.location.city}</span>
            </div>
            <div>
              <span className="text-slate-400">Brand Voice:</span>
              <span className="text-slate-200 ml-2 capitalize">{selectedTemplate.brandVoice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {selectedTemplate && (
        <div className="mt-8 pt-6 border-t border-slate-600">
          <button
            onClick={onNext}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            Continue with {selectedTemplate.name}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
