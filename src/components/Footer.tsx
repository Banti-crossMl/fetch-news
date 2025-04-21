import React from "react";
import { Heart, Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} NewsIntelligence. Demo project.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              This is a News application using simulated AI responses
            </span>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <span className="mx-2">|</span>
            <span className="flex items-center text-xs">
              Made <Heart className="w-3 h-3 mx-1 text-red-500" /> by Banty
              kumar (Software Engineer) / crossml pvt ltd
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
