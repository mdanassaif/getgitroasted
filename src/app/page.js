'use client';

import { useState } from 'react';
import { Laugh, Loader2 } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeProfile = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/analyze?username=${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Our roast engine had a meltdown 🔥');
      }

      setRoast(data);
    } catch (error) {
      console.error('Roast failed:', error);
      setError(error.message || 'Our roast bot is too busy crying over your code to respond');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-yellow text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Get Git Roasted</h2>
          <p className="text-blue-200 mb-8">Just a normal roast to praise you.</p>
          
          <form onSubmit={analyzeProfile} className="mb-8">
            <div className="flex gap-4 justify-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHub username"
                className="px-4 py-2 rounded-lg bg-blue-700 border border-blue-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !username}
                className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Laugh className="w-5 h-5" />}
                {loading ? 'Cooking roast...' : 'Roast Me'}
              </button>
            </div>
          </form>

          {error && <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">{error}</div>}

          {!roast && !loading && (
            <div className="flex flex-col items-center justify-center p-8">
              <img 
                src="/waiting.gif" 
                alt="Waiting" 
                className="rounded-lg h-64 object-cover mb-4"
                loading="lazy"
              />
              <p className="text-xl text-blue-700">Enter a GitHub username to get roasted! </p>
            </div>
          )}

          {roast && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-8 border border-red-500/30 shadow-xl">
                <p className="text-xl text-blue-200 leading-relaxed whitespace-pre-wrap">
                  {roast.story.map((part, partIndex) => (
                    <p key={partIndex} className="mb-4 bg-white/10 rounded-lg p-4 text-left">
                      {part.split(/\b(commits?|stars?|repository|GitHub|code|developer|Python|JavaScript|TypeScript|React|HTML|CSS|Java|PHP|Ruby|Go)\b/gi).map((word, index) => {
                        // Check if the word matches any of our highlight words
                        const isHighlight = /^(commit|star|repository|GitHub|code|developer|Python|JavaScript|TypeScript|React|HTML|CSS|Java|PHP|Ruby|Go)s?$/i.test(word);
                        return isHighlight ? (
                          <span key={index} className="text-red-400">
                            {word}
                          </span>
                        ) : (
                          word
                        );
                      })}
                    </p>
                  ))}
                </p>
              </div>
              
              <div className="bg-blue-800/50 rounded-lg p-6 backdrop-blur-sm border border-blue-700/50">
                <h3 className="text-lg font-semibold mb-3 text-red-300">Roasted Repository</h3>
                <div className="space-y-4">
                  <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-700/30">
                    <h4 className="font-medium text-red-200">{roast.repo.name}</h4>
                    <p className="text-blue-400 text-sm mt-1">
                      {roast.repo.description || 'No description provided (probably too embarrassed)'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-red-500/10 rounded-md text-red-300 text-xs border border-red-500/20">
                        {roast.repo.language}
                      </span>
                      <span className="px-2 py-1 bg-yellow-500/10 rounded-md text-yellow-300 text-xs border border-yellow-500/20">
                        ⭐ {roast.repo.stars} stars
                      </span>
                      <span className="px-2 py-1 bg-blue-500/10 rounded-md text-blue-300 text-xs border border-blue-500/20">
                        Last updated: {roast.repo.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center bg-gradient-to-b from-blue-900 to-yellow p-14">
                <div className="relative group">
                  <img 
                    src={roast.gif} 
                    alt="Reaction GIF" 
                    className="rounded-lg max-w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-yellow/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border-t border-blue-800 pt-8">
            <p className="text-blue-400 mb-4">Built for fun and geeks.</p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/mdanassaif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://twitter.com/mdanassaif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/mdanassaif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://mdanassaif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-red-400 transition-colors"
              >
             
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 32 32"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M29 17v11H3V17M2 8h28v8s-6 4-14 4s-14-4-14-4V8Zm14 14v-4m4-10s0-4-4-4s-4 4-4 4"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}