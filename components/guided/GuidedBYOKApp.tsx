import React, { useState } from 'react';
import { HealthcareClient } from '../../data/clientDatabase';
import { TargetAudience } from './AudienceSelector';
import { MarketingIntent } from '../../data/marketingIntents';
import { TemplateEducation } from './TemplateEducation';
import { TemplateSelector } from './TemplateSelector';
import { ClientSelector } from './ClientSelector';
import { AudienceSelector } from './AudienceSelector';
import { MarketingIntentSelector } from './MarketingIntentSelector';

export interface GuidedCampaign {
  client: HealthcareClient;
  audience: TargetAudience;
  intent: MarketingIntent;
}

interface GuidedBYOKAppProps {
  onCampaignComplete: (campaign: GuidedCampaign) => void;
  onBackToMain?: () => void;
}

type GuidedStep = 1 | 2 | 3 | 4 | 5;

export const GuidedBYOKApp: React.FC<GuidedBYOKAppProps> = ({
  onCampaignComplete,
  onBackToMain
}) => {
  const [currentStep, setCurrentStep] = useState<GuidedStep>(1);
  const [campaign, setCampaign] = useState<Partial<GuidedCampaign>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<HealthcareClient | null>(null);

  const handleTemplateSelected = (template: HealthcareClient) => {
    setSelectedTemplate(template);
    setCampaign(prev => ({ ...prev, client: template }));
  };

  const handleClientSelected = (client: HealthcareClient) => {
    setCampaign(prev => ({ ...prev, client }));
  };

  const handleAudienceSelected = (audience: TargetAudience) => {
    setCampaign(prev => ({ ...prev, audience }));
  };

  const handleIntentSelected = (intent: MarketingIntent) => {
    setCampaign(prev => ({ ...prev, intent }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as GuidedStep);
    } else if (campaign.client && campaign.audience && campaign.intent) {
      // Ensure all required data is present before completing
      if (!campaign.client || !campaign.audience || !campaign.intent) {
        return;
      }
      
      // Pass complete campaign data to parent
      onCampaignComplete({
        client: campaign.client,
        audience: campaign.audience,
        intent: campaign.intent
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as GuidedStep);
    } else if (onBackToMain) {
      onBackToMain();
    }
  };

  const handleStartWithTemplate = () => {
    setCurrentStep(2);
  };

  const handleCreateCustom = () => {
    setCurrentStep(3);
  };

  const getStepProgress = () => {
    const steps = [
      { number: 1, title: 'Choose Method', completed: false },
      { number: 2, title: 'Select Template', completed: !!selectedTemplate },
      { number: 3, title: 'Customize Client', completed: !!campaign.client },
      { number: 4, title: 'Choose Audience', completed: !!campaign.audience },
      { number: 5, title: 'Set Intent', completed: !!campaign.intent }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MediGenius</h1>
                <p className="text-slate-400 text-sm">Guided BYOK Campaign Builder</p>
              </div>
            </div>

            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Main
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {getStepProgress().map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep > step.number || step.completed
                        ? 'bg-emerald-500 text-white'
                        : currentStep === step.number
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {step.completed ? '✓' : step.number}
                    </div>
                    <span className={`text-xs mt-1 ${
                      currentStep >= step.number ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < getStepProgress().length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all ${
                      step.completed ? 'bg-emerald-500' : 'bg-slate-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <TemplateEducation
            onStartWithTemplate={handleStartWithTemplate}
            onCreateCustom={handleCreateCustom}
          />
        )}

        {currentStep === 2 && (
          <TemplateSelector
            onTemplateSelected={handleTemplateSelected}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && (
          <ClientSelector
            onClientSelected={handleClientSelected}
            onNext={handleNext}
            selectedTemplate={selectedTemplate}
          />
        )}

        {currentStep === 4 && (
          <AudienceSelector
            onAudienceSelected={handleAudienceSelected}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <MarketingIntentSelector
            onIntentSelected={handleIntentSelected}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* Campaign Summary Sidebar */}
        {(campaign.client || campaign.audience || campaign.intent) && (
          <div className="mt-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Summary</h3>

            {campaign.client && (
              <div className="mb-4">
                <h4 className="text-sky-400 font-medium mb-2">🏥 Client</h4>
                <p className="text-slate-300 text-sm">{campaign.client.name}</p>
                <p className="text-slate-400 text-xs">{campaign.client.specialty} • {campaign.client.location.city}</p>
              </div>
            )}

            {campaign.audience && (
              <div className="mb-4">
                <h4 className="text-emerald-400 font-medium mb-2">👥 Audience</h4>
                <p className="text-slate-300 text-sm">{campaign.audience.label}</p>
                <p className="text-slate-400 text-xs">{campaign.audience.description}</p>
              </div>
            )}

            {campaign.intent && (
              <div className="mb-4">
                <h4 className="text-purple-400 font-medium mb-2">🎯 Intent</h4>
                <p className="text-slate-300 text-sm">{campaign.intent.title}</p>
                <p className="text-slate-400 text-xs">{campaign.intent.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
