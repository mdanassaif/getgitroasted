import React from 'react';

interface RoastHighlighterProps {
  text: string;
}

const RoastHighlighter: React.FC<RoastHighlighterProps> = ({ text }) => {
  // List of tech terms to highlight
  const techTerms = [
    'commit', 'commits', 'star', 'stars', 'repository', 'repositories', 
    'GitHub', 'code', 'developer', 'Python', 'JavaScript', 'TypeScript', 
    'React', 'HTML', 'CSS', 'Java', 'PHP', 'Ruby', 'Go', 'code', 'API',
    'function', 'git', 'push', 'pull', 'merge', 'branch', 'fork'
  ];
  
  // Create a regex pattern that matches whole words only
  const pattern = new RegExp(`\\b(${techTerms.join('|')})s?\\b`, 'gi');
  
  // Split the text by the pattern, including the matches
  const parts = text.split(pattern);
  
  return (
    <p className="text-slate-700 leading-relaxed">
      {parts.map((part, index) => {
        // Check if this part matches any of our tech terms (case insensitive)
        const isHighlight = techTerms.some(term => 
          new RegExp(`^${term}s?$`, 'i').test(part)
        );
        
        return isHighlight ? (
          <span key={index} className="text-red-500 font-medium">
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </p>
  );
};

export default RoastHighlighter;