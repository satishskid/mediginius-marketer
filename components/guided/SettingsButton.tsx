import React, { useState, useEffect } from 'react';
import { ApiKeys } from '../../types';
import { ApiStatusChecker } from '../ApiStatusChecker';
import { ApiKeyWallet } from '../ApiKeyWallet';
import { Settings, CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff, Key } from 'lucide-react';

interface SettingsButtonProps {
  apiKeys: ApiKeys;
  className?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ apiKeys, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'api-keys' | 'admin'>('api-keys');
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'warning' | 'error'>('warning');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin (you can customize this logic)
  useEffect(() => {
    // For demo purposes, check for admin flag in localStorage
    // In production, this should be based on user authentication/role
    const adminFlag = localStorage.getItem('mediGeniusAdminMode') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  // Calculate overall API health status
  useEffect(() => {
    const hasAnyKey = apiKeys.geminiApiKey || apiKeys.groqApiKey || apiKeys.openRouterApiKey || apiKeys.stabilityApiKey;
    const hasPrimaryKey = apiKeys.geminiApiKey;

    if (hasPrimaryKey) {
      setOverallStatus('healthy');
    } else if (hasAnyKey) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('error');
    }
  }, [apiKeys]);

  const getStatusIcon = () => {
    switch (overallStatus) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'healthy':
        return 'border-green-500/50 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Settings Button */}
      <button
        data-settings-button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full border-2 transition-all duration-200 hover:scale-105 ${getStatusColor()}`}
        title="API Settings & Health Check"
      >
        <Settings className="h-5 w-5 text-slate-300" />
        <div className="absolute -top-1 -right-1">
          {getStatusIcon()}
        </div>

        {/* Pulse animation for warning/error states */}
        {(overallStatus === 'warning' || overallStatus === 'error') && (
          <div className={`absolute inset-0 rounded-full animate-ping ${
            overallStatus === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`} />
        )}
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="absolute right-0 top-14 w-96 max-w-[90vw] bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Settings</h3>
                    <p className="text-slate-400 text-sm">API keys and usage guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-slate-600 mb-6">
                <button
                  onClick={() => setActiveTab('api-keys')}
                  className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'api-keys'
                      ? 'border-sky-500 text-sky-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </button>
                {isAdmin && (
                  <button
                    data-admin-tab
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'admin'
                        ? 'border-red-500 text-red-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'api-keys' ? (
                /* API Keys Tab - BYOK Setup */
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">API Key Management</h4>
                    <p className="text-slate-400 text-sm">Bring Your Own Keys (BYOK) - Enhance your content generation</p>
                  </div>

                  <ApiKeyWallet
                    onSave={(newKeys) => {
                      // Update the apiKeys in the parent component
                      // This will be handled by the parent App component
                      console.log('API Keys updated:', newKeys);
                    }}
                    initialKeys={apiKeys}
                    isGeminiKeyFromEnvAvailable={false} // We'll need to pass this from parent
                  />

                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Why Add Your Own API Keys?
                    </h5>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><span className="text-sky-400 font-medium">🎯 Better Quality:</span> Your own API keys provide more reliable and higher-quality content generation</p>
                      <p><span className="text-sky-400 font-medium">⚡ Faster Generation:</span> Direct API access means quicker response times</p>
                      <p><span className="text-sky-400 font-medium">🔒 Privacy:</span> Your content stays within your API provider's infrastructure</p>
                      <p><span className="text-sky-400 font-medium">🎨 More Options:</span> Access to additional AI models and customization features</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'admin' && isAdmin ? (
                /* Admin Dashboard Tab */
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Admin Dashboard</h4>
                    <p className="text-slate-400 text-sm">API Management & Product Information</p>
                  </div>

                  {/* Overall Status */}
                  <div className="mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {overallStatus === 'healthy' ? (
                          <Wifi className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                          <WifiOff className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <span className="text-white font-medium">System Health Status</span>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        overallStatus === 'healthy'
                          ? 'bg-green-500/20 text-green-300'
                          : overallStatus === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {overallStatus === 'healthy' ? 'Healthy' :
                         overallStatus === 'warning' ? 'Limited' : 'Needs Setup'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mt-2">
                      {overallStatus === 'healthy'
                        ? 'All systems operational. Ready to generate content!'
                        : overallStatus === 'warning'
                        ? 'Some services available. Content generation may be limited.'
                        : 'API keys required. Please configure your keys to get started.'
                      }
                    </p>
                  </div>

                  {/* Product Usage Guide */}
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">📚</span>
                      MediGenius Usage Guide
                    </h5>
                    <p className="text-slate-300 text-sm mb-4">Comprehensive guide for administrators and power users</p>

                    {/* Workflow Selection */}
                    <div className="mb-4">
                      <h6 className="text-white font-medium mb-3 flex items-center">
                        <span className="mr-2">🔄</span>
                        Available Workflows
                      </h6>
                      <div className="space-y-3">
                        {/* Traditional Form */}
                        <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-sky-500/20 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-sky-400 font-bold text-xs">📝</span>
                            </div>
                            <h6 className="text-sm font-semibold text-sky-300">Traditional Form</h6>
                          </div>
                          <div className="text-slate-300 text-xs space-y-1 ml-8">
                            <p><span className="text-sky-400 font-medium">Best for:</span> Quick content generation, experienced users</p>
                            <p><span className="text-sky-400 font-medium">Steps:</span></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Fill in your specialty, location, and target audience</li>
                              <li>Add optional topic or tone preferences</li>
                              <li>Click generate to get AI-powered content instantly</li>
                              <li>Review and customize the generated content</li>
                            </ul>
                          </div>
                        </div>

                        {/* Guided Wizard */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-emerald-400 font-bold text-xs">🧭</span>
                            </div>
                            <h6 className="text-sm font-semibold text-emerald-300">Guided Wizard</h6>
                          </div>
                          <div className="text-slate-300 text-xs space-y-1 ml-8">
                            <p><span className="text-emerald-400 font-medium">Best for:</span> New users, comprehensive campaigns</p>
                            <p><span className="text-emerald-400 font-medium">Steps:</span></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Select healthcare client from templates or create custom</li>
                              <li>Choose your target audience segment</li>
                              <li>Pick your marketing intent and goals</li>
                              <li>AI generates platform-specific content automatically</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Best Practices */}
                    <div className="mb-4">
                      <h6 className="text-white font-medium mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Best Practices for Success
                      </h6>
                      <div className="text-slate-300 text-xs space-y-2">
                        <div className="flex items-start">
                          <span className="text-purple-400 font-bold mr-2 text-xs">🎯</span>
                          <div>
                            <p className="font-medium">Be Specific with Your Input</p>
                            <p className="text-slate-400 text-xs">The more specific you are about your specialty, location, and audience, the better the AI-generated content will be.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-purple-400 font-bold mr-2 text-xs">⚕️</span>
                          <div>
                            <p className="font-medium">Healthcare Compliance</p>
                            <p className="text-slate-400 text-xs">Always review AI-generated content for medical accuracy and compliance with healthcare regulations.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-purple-400 font-bold mr-2 text-xs">🎨</span>
                          <div>
                            <p className="font-medium">Customize Before Publishing</p>
                            <p className="text-slate-400 text-xs">Use the generated content as a starting point and customize it to match your brand voice and specific needs.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-purple-400 font-bold mr-2 text-xs">📊</span>
                          <div>
                            <p className="font-medium">Test Different Approaches</p>
                            <p className="text-slate-400 text-xs">Try both workflows to see which one works better for your specific content needs and style.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Platform-Specific Tips */}
                    <div className="mb-4">
                      <h6 className="text-white font-medium mb-3 flex items-center">
                        <span className="mr-2">📱</span>
                        Platform-Specific Tips
                      </h6>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-start">
                          <span className="text-blue-400 font-bold mr-2 text-xs">📘</span>
                          <div>
                            <p className="text-slate-300 text-xs font-medium">Facebook</p>
                            <p className="text-slate-400 text-xs">Focus on community building and educational content. Use engaging questions to boost interaction.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-pink-400 font-bold mr-2 text-xs">📷</span>
                          <div>
                            <p className="text-slate-300 text-xs font-medium">Instagram</p>
                            <p className="text-slate-400 text-xs">Visual storytelling is key. Use Stories for quick tips and Reels for educational content.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-400 font-bold mr-2 text-xs">💬</span>
                          <div>
                            <p className="text-slate-300 text-xs font-medium">WhatsApp</p>
                            <p className="text-slate-400 text-xs">Keep it personal and conversational. Use for appointment reminders and quick health tips.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Status Checker */}
                  <div className="border-t border-slate-600 pt-4">
                    <ApiStatusChecker apiKeys={apiKeys} />
                  </div>

                  {/* Admin Actions */}
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <span className="mr-2">⚙️</span>
                      Admin Actions
                    </h5>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm">
                        Clear All API Keys
                      </button>
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors text-sm">
                        Reset System Cache
                      </button>
                      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm">
                        Export System Logs
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback for unauthorized access */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="h-8 w-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Access Restricted</h4>
                  <p className="text-slate-400 text-sm mb-4">This section is available to administrators only.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
