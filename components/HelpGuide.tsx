import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Info, ChevronDown, ChevronUp, BookOpen, Key, Lightbulb, Heart } from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const HelpGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">📋 Step-by-Step:</h4>
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong className="text-white">Sign In:</strong> Use your Google account or email</li>
              <li><strong className="text-white">Add API Keys (Optional):</strong> For better results, add your free Google Gemini API key</li>
              <li><strong className="text-white">Fill Details:</strong> Enter your specialty, location, and target audience</li>
              <li><strong className="text-white">Generate:</strong> Click the button and wait 10-30 seconds</li>
              <li><strong className="text-white">Use Content:</strong> Copy, customize, and post on your platforms</li>
            </ol>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
            <p className="text-green-200">
              ✅ <strong>Good News:</strong> You can start using MediGenius immediately without any API keys! 
              Images and basic text generation work for free.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'api-keys',
      title: 'API Keys Explained',
      icon: <Key className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">🔑 Optional but Recommended:</h4>
            
            <div className="space-y-3">
              <div className="p-3 border border-sky-400/30 rounded-lg">
                <h5 className="font-semibold text-white">Google Gemini API Key</h5>
                <p className="text-xs text-slate-400 mt-1">FREE from Google AI Studio</p>
                <p className="mt-2">Powers high-quality text generation and premium image creation. Get it at <a href="https://aistudio.google.com" target="_blank" className="text-sky-400 underline hover:text-sky-300">aistudio.google.com</a></p>
              </div>
              
              <div className="p-3 border border-purple-400/30 rounded-lg">
                <h5 className="font-semibold text-white">Unsplash API Key</h5>
                <p className="text-xs text-slate-400 mt-1">FREE (50 requests/hour)</p>
                <p className="mt-2">Provides professional healthcare stock photos. Get it at <a href="https://unsplash.com/developers" target="_blank" className="text-sky-400 underline hover:text-sky-300">unsplash.com/developers</a></p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p className="text-blue-200">
              💡 <strong>Tip:</strong> Start without keys to try the app, then add them later for enhanced features!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: <Lightbulb className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">💡 For Best Results:</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-white">Be Specific:</h5>
                <div className="grid md:grid-cols-2 gap-2 mt-1">
                  <div className="p-2 bg-red-500/10 border border-red-400/30 rounded">
                    <p className="text-red-200 text-xs">❌ "Doctor", "India", "People"</p>
                  </div>
                  <div className="p-2 bg-green-500/10 border border-green-400/30 rounded">
                    <p className="text-green-200 text-xs">✅ "Pediatric Cardiologist", "Pune, Maharashtra", "Parents of children with heart conditions"</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-white">Use Relevant Topics:</h5>
                <p className="text-slate-400">Examples: "World Heart Day", "Monsoon health tips", "New clinic opening", "Winter skin care"</p>
              </div>
              
              <div>
                <h5 className="font-semibold text-white">Choose Appropriate Tone:</h5>
                <ul className="text-slate-400 text-xs space-y-1 mt-1">
                  <li>• <strong>Serious conditions:</strong> "Professional, empathetic, informative"</li>
                  <li>• <strong>Preventive care:</strong> "Friendly, encouraging, motivational"</li>
                  <li>• <strong>Emergency services:</strong> "Clear, urgent, actionable"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'image-generation',
      title: 'Image Generation',
      icon: <Heart className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <h4 className="font-semibold text-sky-300 mb-2">🎨 Smart Image System:</h4>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 border border-yellow-400/30 rounded">
              <span className="text-yellow-400">🏆</span>
              <span><strong className="text-white">Premium:</strong> Google Imagen (requires Gemini key)</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-green-400/30 rounded">
              <span className="text-green-400">🆓</span>
              <span><strong className="text-white">Free AI:</strong> Pollinations.ai (no key needed)</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-blue-400/30 rounded">
              <span className="text-blue-400">📸</span>
              <span><strong className="text-white">Stock:</strong> Unsplash photos (optional key)</span>
            </div>
            <div className="flex items-center space-x-2 p-2 border border-slate-400/30 rounded">
              <span className="text-slate-400">🖼️</span>
              <span><strong className="text-white">Fallback:</strong> Professional placeholder</span>
            </div>
          </div>
          
          <div className="p-3 bg-sky-500/10 border border-sky-400/30 rounded-lg">
            <p className="text-sky-200">
              ⚡ <strong>Always Works:</strong> You'll always get an image, even without any API keys! 
              The system automatically tries different methods until one works.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <Card
      title={
        <>
          <Info className="mr-2 h-6 w-6 text-sky-400" />
          How to Use MediGenius Effectively
        </>
      }
      className="backdrop-blur-sm"
      titleClassName="flex items-center"
    >
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          Learn how to get the most out of MediGenius for your healthcare marketing needs.
        </p>
        
        <div className="space-y-3">
          {helpSections.map((section) => (
            <div key={section.id} className="border border-slate-600/30 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/20 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sky-400">{section.icon}</span>
                  <span className="font-medium text-white">{section.title}</span>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              
              {expandedSection === section.id && (
                <div className="px-4 pb-4">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30 rounded-lg text-center">
          <p className="text-orange-200 text-sm">
            📚 <strong>Need More Help?</strong> Check out the complete user guide in the repository for detailed instructions and troubleshooting.
          </p>
        </div>
      </div>
    </Card>
  );
};
