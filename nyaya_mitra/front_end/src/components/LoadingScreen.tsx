
import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="w-20 h-20 mb-8">
        <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-2xl animate-bounce">न्</span>
            </div>
          </div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-primary">Nyaya</span>
        <span className="text-secondary">Mitra</span>
      </h1>
      
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="mt-4 text-gray-500 dark:text-gray-400">
        {progress < 100 ? "Loading..." : "Welcome!"}
      </p>
    </div>
  );
};

export default LoadingScreen;
