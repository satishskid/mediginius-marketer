import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface RetryPanelProps {
  error: string;
  onRetry: () => void;
  platformName: string;
  isRetrying?: boolean;
}

export const RetryPanel: React.FC<RetryPanelProps> = ({
  error,
  onRetry,
  platformName,
  isRetrying = false
}) => {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-300 mb-1">
            Error generating content for {platformName}
          </h4>
          <p className="text-sm text-red-200/70 mb-3">{error}</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={onRetry}
            icon={<RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
            disabled={isRetrying}
          >
            {isRetrying ? 'Retrying...' : 'Retry Generation'}
          </Button>
        </div>
      </div>
    </div>
  );
};
