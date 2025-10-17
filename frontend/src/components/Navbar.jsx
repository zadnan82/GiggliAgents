import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="text-4xl">🤖</div>
            <div>
              <div className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GiggliAgents
              </div>
              <div className="text-xs text-gray-500 -mt-1">AI Email Automation</div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-semibold transition ${isActive('/') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/templates" 
              className={`font-semibold transition ${isActive('/templates') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Templates
            </Link>
            <Link 
              to="/builder" 
              className={`font-semibold transition ${isActive('/builder') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              Builder
            </Link>
            <a 
              href="https://docs.giggli.com" 
              target="_blank"
              className="font-semibold text-gray-600 hover:text-purple-600 transition"
            >
              Docs
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link 
              to="/templates"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button - TODO */}
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}