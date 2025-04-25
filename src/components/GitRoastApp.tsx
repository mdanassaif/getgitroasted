import React from 'react';
import GitRoastForm from './GitRoastForm';
import GitRoastResult from './GitRoastResult';
import GitRoastFooter from './GitRoastFooter';
import { useGitRoast } from '../hooks/useGitRoast';

const GitRoastApp: React.FC = () => {
  const {
    username,
    setUsername,
    roast,
    loading,
    error,
    analyzeProfile,
    clearError,
    clearResults
  } = useGitRoast();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-teal-700 relative inline-block">
              Get Git Roasted
              <span className="absolute -top-3 -right-6 text-red-500 text-lg transform rotate-12">🔥</span>
            </h1>
            <p className="text-red-500 font-medium">Code so bad, even Git commits treason.</p>
          </header>

          <GitRoastForm
            username={username}
            setUsername={setUsername}
            loading={loading}
            onSubmit={analyzeProfile}
            onReset={clearResults}
          />
          
          {error && (
            <div className="bg-white border border-red-200 rounded-lg p-6 mb-8 text-red-600 max-w-lg mx-auto shadow-sm animate-fade-in">
              <h3 className="font-semibold mb-2">Roasting Error!</h3>
              <p>{error}</p>
              <button 
                onClick={clearError}
                className="mt-4 text-sm text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}

          {!roast && !loading && !error && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-slate-100 mb-8 animate-fade-in">
              <img 
                src="https://media.giphy.com/media/xTiN0IuPQxRqzxodZm/giphy.gif" 
                alt="Developer waiting for roast" 
                className="rounded-lg h-48 md:h-64 object-cover mb-4 shadow-md"
                loading="lazy"
              />
              <p className="text-lg md:text-xl text-teal-600">Enter a GitHub username and prepare for brutal honesty!</p>
            </div>
          )}

          {roast && <GitRoastResult roast={roast} />}
        </div>
      </main>

      <GitRoastFooter />
    </div>
  );
};

export default GitRoastApp;