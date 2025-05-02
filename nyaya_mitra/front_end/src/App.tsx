
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChatbotPage from './pages/ChatbotPage';
import FormPage from './pages/FormPage';
import PdfGeneratorPage from './pages/PdfGeneratorPage';
import NotFound from './pages/NotFound';
import ThemeProvider from './providers/ThemeProvider';
import LiveNewsPage from './pages/LiveNewsPage';  // Updated import path
import LawyerRegistration from './pages/LawyerRegistration';
import LawyerSubscription from './pages/LawyerSubscription';
import FindLawyer from './pages/FindLawyer';



function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/pdf-generator" element={<PdfGeneratorPage />} />
              <Route path="/live-news" element={<LiveNewsPage />} />
              <Route path="/lawyer-subscription" element={<LawyerSubscription />} />
              <Route path="/register-lawyer" element={<LawyerRegistration />} />
              <Route path="/find-lawyer" element={<FindLawyer />} />

              <Route path="*" element={<NotFound />} />


              
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
