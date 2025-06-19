import React, { useState } from 'react';
import { GeneratedContentSet, ChannelType } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CHANNEL_OPTIONS, PLATFORM_URLS } from '../constants';
import { ClipboardCopy, AlertCircle, Image as ImageIcon, Video, FileText, Info, ExternalLink } from 'lucide-react';

interface ResultsDisplayProps {
  contentSet: GeneratedContentSet;
}

const ResultItem: React.FC<{ 
  channelType: ChannelType; 
  title: string; 
  content: string; 
  error?: string; 
  onCopy: (textToCopy: string) => void 
}> = ({ channelType, title, content, error, onCopy }) => {
  
  const isImageChannel = channelType === ChannelType.GENERATED_IMAGE;
  const isBlogIdeaChannel = channelType === ChannelType.BLOG_IDEA;
  const platformInfo = PLATFORM_URLS[channelType];

  const getIcon = () => {
    switch(channelType) {
      case ChannelType.GENERATED_IMAGE:
        return <ImageIcon size={18} className="mr-2 text-purple-400"/>;
      case ChannelType.VIDEO_SCRIPT:
        return <Video size={18} className="mr-2 text-orange-400"/>;
      case ChannelType.BLOG_IDEA:
        return <FileText size={18} className="mr-2 text-indigo-400"/>;
      default:
        return null;
    }
  }

  const openPlatformLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 hover:border-sky-700/70 transition-all duration-200 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-sky-400 flex items-center">
          {getIcon()}
          {title}
        </h4>
        <div className="flex items-center space-x-2 shrink-0">
          {platformInfo && !error && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => openPlatformLink(platformInfo.url)} 
              icon={<ExternalLink size={16}/>}
              title={`Open ${platformInfo.name}`}
              className="bg-slate-600 hover:bg-slate-500"
            >
              {platformInfo.name}
            </Button>
          )}
          {platformInfo?.secondaryUrl && !error && (
             <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => openPlatformLink(platformInfo.secondaryUrl!.url)} 
              icon={<ExternalLink size={16}/>}
              title={`Open ${platformInfo.secondaryUrl.name}`}
              className="bg-slate-600 hover:bg-slate-500"
            >
              {platformInfo.secondaryUrl.name}
            </Button>
          )}
          {!isImageChannel && !error && ( 
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onCopy(content)} 
              icon={<ClipboardCopy size={16}/>}
              title="Copy content"
              className="bg-sky-700 hover:bg-sky-600"
            >
              Copy
            </Button>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-2 p-3 bg-red-900/60 text-red-300 text-sm rounded-md flex items-center shadow-inner">
          <AlertCircle size={16} className="mr-2 shrink-0"/> 
          <span className="truncate">{error.length > 150 ? error.substring(0,150) + "..." : error}</span>
        </div>
      )}
      {!error && isImageChannel ? (
        <div className="mt-2 flex-grow flex items-center justify-center bg-slate-700/30 p-2 rounded-md overflow-hidden">
          <img 
            src={`data:image/jpeg;base64,${content}`} 
            alt={title || "Generated Image"} 
            className="max-w-full max-h-80 object-contain rounded shadow-lg"
          />
        </div>
      ) : !error ? (
        <>
          <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-700/50 p-4 rounded-md overflow-x-auto max-h-60 flex-grow shadow-inner">
            {content}
          </pre>
          {isBlogIdeaChannel && (
            <div className="mt-3 p-3 bg-sky-900/40 border border-sky-800 text-sky-300 text-xs rounded-md flex items-start">
              <Info size={16} className="mr-2 mt-0.5 shrink-0 text-sky-400"/>
              <span>
                <strong>HubSpot Tip:</strong> Copy this structured content. In HubSpot, create a new blog post, paste this as a starting point, and use HubSpot's editor and SEO tools to refine and publish. Use the "Open HubSpot" button to quickly navigate.
              </span>
            </div>
          )}
        </>
      ) : null}
    </Card>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ contentSet }) => {
  const [showCopiedNotification, setShowCopiedNotification] = useState<boolean>(false);

  const handleCopy = (textToCopy: string) => {
    if(!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again or copy manually.');
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-3xl font-semibold text-center text-sky-300 mb-8">Generated Marketing Suite</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHANNEL_OPTIONS.map(opt => {
          const item = contentSet[opt.value];
          
          if (!item && opt.value !== ChannelType.GENERATED_IMAGE) return null; 
          if (!item && opt.value === ChannelType.GENERATED_IMAGE && (!contentSet[ChannelType.IMAGE_PROMPT] || contentSet[ChannelType.IMAGE_PROMPT].error)) {
            return null;
          }
           if (!item && opt.value === ChannelType.GENERATED_IMAGE) {
            // If image generation was skipped or failed, don't render its card unless there's an error to show
            if (contentSet[ChannelType.GENERATED_IMAGE]?.error) {
                 // allow rendering if there's an error to display for GENERATED_IMAGE
            } else {
                 return null;
            }
           }
           if (!item) return null;


          return (
            <ResultItem 
              key={opt.value}
              channelType={opt.value}
              title={opt.label}
              content={item.content}
              error={item.error}
              onCopy={handleCopy}
            />
          );
        })}
      </div>
       {showCopiedNotification && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2.5 px-5 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-50 flex items-center">
          <ClipboardCopy size={18} className="mr-2"/> Copied to clipboard!
        </div>
      )}
    </div>
  );
};
