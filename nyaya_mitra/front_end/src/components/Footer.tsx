
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-10 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">न्</span>
              </div>
              <span className="text-xl font-bold text-primary">
                Nyaya<span className="text-secondary">Mitra</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Nyaya Mitra is your trusted companion for legal assistance in India, 
              providing AI-powered guidance, document creation, and personalized legal support.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/chatbot" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Legal AI
                </Link>
              </li>
              <li>
                <Link 
                  to="/form" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Assistance Form
                </Link>
              </li>
              <li>
                <Link 
                  to="/pdf-generator" 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Document Generator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">
                Email: info@nyayamitra.in
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                Phone: +91 98765 43210
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                Address: New Delhi, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 Nyaya Mitra. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
