import { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';

const LiveNewsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "ee43efadf7b1428f95d502a589ea3bab";
  const URL = `https://newsapi.org/v2/everything?q=Supreme Court OR High Court OR Constitution OR law OR legislation OR court&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(URL);
      const data = await res.json();

      if (data.status !== "ok") {
        throw new Error("Failed to fetch news");
      }

      setNews(data.articles.slice(0, 12));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      Loading news...
    </div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <button 
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-md ${
          theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
        }`}
      >
        {theme === 'dark' ? ' ' : ''}
      </button>

      <div className="container mx-auto px-4 py-8">
        <br>
        </br>
        <br></br>
      <h1 className="text-3xl pl-16 font-bold mb-8">📰 Latest Legal News</h1>        
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg shadow-md transition-transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <h2 className="font-bold text-lg mb-2">{article.title}</h2>
                <p className="text-sm mb-2">Source: {article.source?.name || 'Unknown'}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`font-medium ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  Read more →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveNewsPage;