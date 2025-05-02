
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, FileText, FileType } from 'lucide-react';

const Home = () => {
  // Add scroll reveal animation on mount
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;
        
        if (isVisible) {
          element.classList.add('animate-fade-up');
          element.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', animateElements);
    // Initial check
    animateElements();
    
    return () => window.removeEventListener('scroll', animateElements);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 animate-fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your AI-Powered <span className="text-primary">Legal Assistant</span> for India
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                Nyaya Mitra helps you navigate the complex legal system in India with AI-powered guidance, document generation, and personalized support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/chatbot" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/form" className="btn-outline">
                  Get Legal Help
                </Link>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Legal Topics</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assistance</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl text-primary">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free</div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 animate-float">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 flex flex-col">
                    <div className="text-2xl font-bold mb-4 text-primary">Nyaya Mitra</div>
                    <div className="flex-1 overflow-hidden">
                      <div className="mb-3">
                        <div className="chat-bubble-bot text-sm">
                          How can I assist you with legal matters today?
                        </div>
                      </div>
                      <div className="mb-3 flex justify-end">
                        <div className="chat-bubble-user text-sm">
                          I need help with a rental agreement
                        </div>
                      </div>
                      <div>
                        <div className="chat-bubble-bot text-sm">
                          I can guide you through rental agreement requirements in India...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path 
              fill="currentColor" 
              fillOpacity="0.04"
              d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 opacity-0 animate-on-scroll">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto opacity-0 animate-on-scroll">
              Nyaya Mitra offers a comprehensive suite of legal assistance tools designed specifically for Indian citizens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chatbot Feature */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-on-scroll">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal AI Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ask questions about any legal topic and get instant, 
                accurate guidance based on Indian law.
              </p>
              <Link to="/chatbot" className="text-primary hover:underline font-medium inline-flex items-center">
                Chat now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            {/* Form Feature */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-on-scroll">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FileText size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Legal Assistance Form</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Submit your information and details about your legal situation to receive personalized guidance.
              </p>
              <Link to="/form" className="text-primary hover:underline font-medium inline-flex items-center">
                Get started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            {/* PDF Generator Feature */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 opacity-0 animate-on-scroll">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FileType size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Generator</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate legal documents and letters based on your inputs, ready for use in various legal proceedings.
              </p>
              <Link to="/pdf-generator" className="text-primary hover:underline font-medium inline-flex items-center">
                Create document
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-900 section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 opacity-0 animate-on-scroll">
              How <span className="text-primary">It Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto opacity-0 animate-on-scroll">
              Nyaya Mitra simplifies legal assistance through an easy-to-follow process.
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative z-10 opacity-0 animate-on-scroll">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                  <h3 className="text-xl font-semibold mb-3">Choose Your Tool</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select from our AI chat, assistance form, or document generator based on your needs.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 opacity-0 animate-on-scroll">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                  <h3 className="text-xl font-semibold mb-3">Provide Information</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share details about your legal situation or requirements through our user-friendly interface.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 opacity-0 animate-on-scroll">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                  <h3 className="text-xl font-semibold mb-3">Get Results</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Receive instant guidance, personalized advice, or downloadable legal documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary to-tertiary rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 sm:px-12 sm:py-16 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  Ready to Solve Your Legal Challenges?
                </h2>
                <p className="text-white/90 text-lg max-w-2xl">
                  Get started with Nyaya Mitra today and access free legal assistance powered by cutting-edge AI technology.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <Link 
                  to="/chatbot" 
                  className="inline-block bg-white text-primary font-medium px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
