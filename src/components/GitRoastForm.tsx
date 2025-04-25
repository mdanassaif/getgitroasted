import React, { FormEvent } from 'react';
import { Laugh, Loader2, Search, RefreshCw } from 'lucide-react';

interface GitRoastFormProps {
  username: string;
  setUsername: (username: string) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
  onReset: () => void;
}

const GitRoastForm: React.FC<GitRoastFormProps> = ({
  username,
  setUsername,
  loading,
  onSubmit,
  onReset
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
      <div className="flex flex-col gap-4">
        <label htmlFor="username" className="text-teal-700 font-medium">
          GitHub Username
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., octocat"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-700"
            aria-label="GitHub username"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            type="submit"
            disabled={loading || !username}
            className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium shadow-sm"
            aria-label={loading ? "Analyzing GitHub profile" : "Roast this GitHub profile"}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cooking up a roast...</span>
              </>
            ) : (
              <>
                <Laugh className="w-5 h-5" />
                <span>Roast Me</span>
              </>
            )}
          </button>
          
          {username && (
            <button
              type="button"
              onClick={onReset}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              aria-label="Reset form"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default GitRoastForm;