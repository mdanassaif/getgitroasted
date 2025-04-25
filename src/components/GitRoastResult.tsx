import React, { useEffect, useState } from 'react';
import { Calendar, Code, Star, Share2 } from 'lucide-react';
import { RoastData } from '../types/roast';
import RoastHighlighter from './RoastHighlighter';

interface GitRoastResultProps {
  roast: RoastData;
}

const GitRoastResult: React.FC<GitRoastResultProps> = ({ roast }) => {
  const [copied, setCopied] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a slight delay before showing the content to enable animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const textToShare = roast.story.join('\n\n');
    navigator.clipboard.writeText(textToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add classes conditionally based on visibility state
  const visibilityClass = isVisible 
    ? 'opacity-100 transform translate-y-0' 
    : 'opacity-0 transform translate-y-8';

  return (
    <div className={`space-y-6 transition-all duration-500 ease-out ${visibilityClass}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100">
        <div className="p-4 md:p-6 bg-gradient-to-r from-teal-50 to-slate-50">
          <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-red-500" />
            Git Roast Results
          </h2>
          
          <div className="space-y-4">
            {roast.story.map((part, index) => (
              <div 
                key={index} 
                className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <RoastHighlighter text={part} />
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleShare}
            className="mt-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy roast'}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4 text-teal-800 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Roasted Repository
          </h3>
          
          <div className="rounded-lg p-5 bg-gradient-to-r from-slate-50 to-white border border-slate-100">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-red-500 text-lg">{roast.repo.name}</h4>
              <span className="px-2 py-1 bg-yellow-50 rounded-md text-yellow-600 text-xs border border-yellow-200 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {roast.repo.stars}
              </span>
            </div>
            
            <p className="text-slate-600 text-sm mt-3">
              {roast.repo.description || 'No description provided (probably too embarrassed)'}
            </p>
            
            <div className="mt-4 flex items-center text-xs text-slate-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Last updated: {roast.repo.lastUpdate}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {roast.repo.languages && roast.repo.languages.map((lang, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-teal-50 rounded-md text-teal-700 text-xs border border-teal-100"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center p-4">
        <div className="relative group overflow-hidden rounded-lg shadow-md border border-slate-100">
          <img 
            src={roast.gif} 
            alt="Developer reaction" 
            className="w-full max-w-md h-48 md:h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  );
};

export default GitRoastResult;