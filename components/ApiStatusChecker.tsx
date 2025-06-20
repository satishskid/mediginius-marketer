import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiKeys } from '../types';
import { checkDefaultGeminiEnvKey } from '../services/geminiService';

interface ApiStatus {
  service: string;
  status: 'checking' | 'success' | 'error' | 'warning' | 'not-tested';
  message: string;
  responseTime?: number;
}

interface ApiStatusCheckerProps {
  apiKeys: ApiKeys;
}

export const ApiStatusChecker: React.FC<ApiStatusCheckerProps> = ({ apiKeys }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusResults, setStatusResults] = useState<ApiStatus[]>([]);

  const getStatusIcon = (status: ApiStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: ApiStatus['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      case 'warning':
        return 'text-yellow-300';
      case 'checking':
        return 'text-yellow-300';
      default:
        return 'text-slate-400';
    }
  };

  const checkGeminiApi = async (): Promise<ApiStatus> => {
    const startTime = Date.now();
    
    try {
      const envKey = checkDefaultGeminiEnvKey();
      const keyToUse = apiKeys.geminiApiKey || envKey;
      
      if (!keyToUse) {
        return {
          service: 'Google Gemini API',
          status: 'warning',
          message: 'No API key provided (will use fallback services)',
          responseTime: Date.now() - startTime
        };
      }

      // Simple test API call to verify the key
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + keyToUse);
      
      if (response.ok) {
        return {
          service: 'Google Gemini API',
          status: 'success',
          message: 'Connected successfully',
          responseTime: Date.now() - startTime
        };
      } else if (response.status === 403) {
        return {
          service: 'Google Gemini API',
          status: 'error',
          message: 'Invalid API key or permissions denied',
          responseTime: Date.now() - startTime
        };
      } else {
        return {
          service: 'Google Gemini API',
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          responseTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        service: 'Google Gemini API',
        status: 'error',
        message: `Connection failed: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkUnsplashApi = async (): Promise<ApiStatus> => {
    const startTime = Date.now();
    
    try {
      if (!apiKeys.unsplashApiKey) {
        return {
          service: 'Unsplash Stock Photos',
          status: 'warning',
          message: 'No API key provided (optional service)',
          responseTime: Date.now() - startTime
        };
      }

      const response = await fetch('https://api.unsplash.com/me', {
        headers: {
          'Authorization': `Client-ID ${apiKeys.unsplashApiKey}`
        }
      });

      if (response.ok) {
        return {
          service: 'Unsplash Stock Photos',
          status: 'success',
          message: 'Connected successfully',
          responseTime: Date.now() - startTime
        };
      } else if (response.status === 403 || response.status === 401) {
        return {
          service: 'Unsplash Stock Photos',
          status: 'error',
          message: 'Invalid API key',
          responseTime: Date.now() - startTime
        };
      } else {
        return {
          service: 'Unsplash Stock Photos',
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          responseTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        service: 'Unsplash Stock Photos',
        status: 'error',
        message: `Connection failed: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkFreeImageService = async (): Promise<ApiStatus> => {
    const startTime = Date.now();
    
    try {
      // Test if the free image service is accessible
      const testResponse = await fetch('https://image.pollinations.ai/prompt/test?width=64&height=64&nologo=true');
      
      if (testResponse.ok) {
        return {
          service: 'Free AI Image Generation',
          status: 'success',
          message: 'Pollinations.ai service available',
          responseTime: Date.now() - startTime
        };
      } else {
        return {
          service: 'Free AI Image Generation',
          status: 'warning',
          message: 'Service temporarily unavailable (will fallback to placeholder)',
          responseTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        service: 'Free AI Image Generation',
        status: 'warning',
        message: 'Service check failed (will fallback to placeholder)',
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkGroqApi = async (): Promise<ApiStatus> => {
    const startTime = Date.now();
    
    if (!apiKeys.groqApiKey) {
      return {
        service: 'Groq API (Fast Text)',
        status: 'warning',
        message: 'No API key provided (optional service)',
        responseTime: Date.now() - startTime
      };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKeys.groqApiKey}`
        }
      });

      if (response.ok) {
        return {
          service: 'Groq API (Fast Text)',
          status: 'success',
          message: 'Connected successfully',
          responseTime: Date.now() - startTime
        };
      } else if (response.status === 401) {
        return {
          service: 'Groq API (Fast Text)',
          status: 'error',
          message: 'Invalid API key',
          responseTime: Date.now() - startTime
        };
      } else {
        return {
          service: 'Groq API (Fast Text)',
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          responseTime: Date.now() - startTime
        };
      }
    } catch (error: any) {
      return {
        service: 'Groq API (Fast Text)',
        status: 'error',
        message: `Connection failed: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  };

  const runSystemCheck = async () => {
    setIsChecking(true);
    setStatusResults([]);

    const checks = [
      checkGeminiApi,
      checkFreeImageService,
      checkUnsplashApi,
      checkGroqApi
    ];

    const results: ApiStatus[] = [];

    for (const check of checks) {
      try {
        const result = await check();
        results.push(result);
        setStatusResults([...results]);
      } catch (error: any) {
        results.push({
          service: 'Unknown Service',
          status: 'error',
          message: `Unexpected error: ${error.message}`,
          responseTime: 0
        });
        setStatusResults([...results]);
      }
    }

    setIsChecking(false);
  };

  const getOverallStatus = (): { status: ApiStatus['status']; message: string } | null => {
    if (statusResults.length === 0) return null;
    
    const hasErrors = statusResults.some(r => r.status === 'error');
    const hasWarnings = statusResults.some(r => r.status === 'warning');
    const allSuccess = statusResults.every(r => r.status === 'success');

    if (allSuccess) return { status: 'success', message: 'All systems operational' };
    if (hasErrors) return { status: 'error', message: 'Some services have issues' };
    if (hasWarnings) return { status: 'warning', message: 'All systems working (some optional services missing)' };
    return { status: 'warning', message: 'System check incomplete' };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card
      title={
        <>
          <RefreshCw className="mr-2 h-6 w-6 text-sky-400" />
          System Status Check
        </>
      }
      className="backdrop-blur-sm"
      titleClassName="flex items-center"
    >
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          Check the connectivity and status of all API services.
        </p>

        <Button
          onClick={runSystemCheck}
          disabled={isChecking}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking Systems...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run System Check
            </>
          )}
        </Button>

        {overallStatus && (
          <div className={`p-3 rounded-lg border flex items-center space-x-3 ${
            overallStatus.status === 'success' 
              ? 'bg-green-500/10 border-green-400/30' 
              : overallStatus.status === 'error'
              ? 'bg-red-500/10 border-red-400/30'
              : 'bg-yellow-500/10 border-yellow-400/30'
          }`}>
            {getStatusIcon(overallStatus.status)}
            <span className={`font-medium ${getStatusColor(overallStatus.status)}`}>
              {overallStatus.message}
            </span>
          </div>
        )}

        {statusResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Service Status:</h4>
            {statusResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-white">{result.service}</p>
                    <p className={`text-xs ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                {result.responseTime && (
                  <span className="text-xs text-slate-400">
                    {result.responseTime}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-3 bg-slate-800/30 border border-slate-600/30 rounded-lg text-xs text-slate-400">
          <p><strong className="text-slate-300">Note:</strong> Free services (like Pollinations.ai) work without API keys. Optional services enhance functionality but aren't required for basic operation.</p>
        </div>
      </div>
    </Card>
  );
};
