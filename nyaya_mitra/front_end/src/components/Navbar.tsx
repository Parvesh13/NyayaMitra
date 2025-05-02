import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Newspaper, Search, UserPlus } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">न्</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              Nyaya<span className="text-secondary">Mitra</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/chatbot" 
              className={`nav-link ${location.pathname === '/chatbot' ? 'active' : ''}`}
            >
              Legal AI
            </Link>
            <Link 
              to="/find-lawyer" 
              className={`nav-link ${location.pathname === '/find-lawyer' ? 'active' : ''}`}
            >
              <Search size={18} className="inline mr-1" />
              Find Lawyer
            </Link>
            <Link 
              to="/register-lawyer" 
              className={`nav-link ${location.pathname === '/register-lawyer' ? 'active' : ''}`}
            >
              <UserPlus size={18} className="inline mr-1" />
              Register as Lawyer
            </Link>
            <Link 
              to="/pdf-generator" 
              className={`nav-link ${location.pathname === '/pdf-generator' ? 'active' : ''}`}
            >
              Document Generator
            </Link>
            <Link
              to="/live-news"
              className={`nav-link ${location.pathname === '/live-news' ? 'active' : ''}`}
            >
              <Newspaper size={18} className="inline mr-1" />
              Live News
            </Link>
            <button 
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleTheme}
              className="mr-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-slide-in-right">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="nav-link-mobile"
            >
              Home
            </Link>
            <Link 
              to="/chatbot" 
              className="nav-link-mobile"
            >
              Legal AI
            </Link>
            <Link 
              to="/find-lawyer" 
              className="nav-link-mobile flex items-center"
            >
              <Search size={18} className="mr-2" />
              Find Lawyer
            </Link>
            <Link 
              to="/register-lawyer" 
              className="nav-link-mobile flex items-center"
            >
              <UserPlus size={18} className="mr-2" />
              Register as Lawyer
            </Link>
            <Link 
              to="/pdf-generator" 
              className="nav-link-mobile"
            >
              Document Generator
            </Link>
            <Link
              to="/live-news"
              className="nav-link-mobile flex items-center"
            >
              <Newspaper size={18} className="mr-2" />
              Live News
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;