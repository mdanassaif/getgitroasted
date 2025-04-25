import React from 'react';
import { Github, Twitter, Linkedin, Globe } from 'lucide-react';

const GitRoastFooter: React.FC = () => {
  return (
    <footer className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="border-t border-slate-200 pt-8">
          <p className="text-slate-600 mb-4 text-center">Built for developers with a sense of humor.</p>
          
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-red-500 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-red-500 transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-red-500 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://mdanassaif.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-red-500 transition-colors"
              aria-label="Portfolio Website"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-center mt-6 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Get Git Roasted. No feelings were spared in the making of this app.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GitRoastFooter;