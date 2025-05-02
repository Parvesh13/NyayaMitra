import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, AlertCircle, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
  isSpeaking?: boolean;
}

const API_URL = 'http://localhost:5000/api/chat';
const LOGS_URL = 'http://localhost:5000/query_logs';

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isScrolledUp = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch(LOGS_URL);
        if (response.ok) {
          const text = await response.text();
          if (text.trim()) {
            const logs = text.split('\n').filter(line => line.trim());
            const history = logs.map(log => {
              const [role, content, timestamp] = log.split('|');
              return {
                id: Date.now().toString() + Math.random(),
                role: role as 'user' | 'bot' | 'error',
                content: decodeURIComponent(content),
                timestamp: new Date(timestamp),
                isSpeaking: false
              };
            });
            setMessages(history);
            return;
          }
        }
        setMessages([{
          id: '1',
          role: 'bot',
          content: 'Hello! I am your legal assistant. Ask me anything about Indian law.',
          timestamp: new Date(),
          isSpeaking: false
        }]);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([{
          id: '1',
          role: 'bot',
          content: 'Hello! I am your legal assistant. Ask me anything about Indian law.',
          timestamp: new Date(),
          isSpeaking: false
        }]);
      }
    };

    loadChatHistory();
  }, []);

  // Save chat history
  useEffect(() => {
    const saveChatHistory = async () => {
      if (messages.length === 0) return;
      try {
        const logContent = messages
          .map(msg => `${msg.role}|${encodeURIComponent(msg.content)}|${msg.timestamp.toISOString()}`)
          .join('\n');
        await fetch(LOGS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: logContent,
        });
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    };

    saveChatHistory();
  }, [messages]);

  // Scroll handling
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isScrolledUp.current = 
        container.scrollHeight - container.scrollTop > container.clientHeight + 50;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Smart scroll behavior
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || isScrolledUp.current) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  // Auto-dismiss errors
  useEffect(() => {
    if (ttsError) {
      const timer = setTimeout(() => setTtsError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [ttsError]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = (message: Message) => {
    if (!window.speechSynthesis) {
      setTtsError('Text-to-speech not supported in your browser');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    setTtsError(null);

    // If this message is already speaking, stop it
    if (message.isSpeaking) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isSpeaking: false } : m
      ));
      return;
    }

    // Start speaking this message
    const utterance = new SpeechSynthesisUtterance(message.content);
    const voices = window.speechSynthesis.getVoices();
    const hindiEnglishVoice = voices.find(v => v.lang === 'en-IN') || null;
    
    if (hindiEnglishVoice) {
      utterance.voice = hindiEnglishVoice;
    }

    // Set faster speech rate (1.1x)
    utterance.rate = 1.1;
    utterance.pitch = 1;

    // Update UI state
    setMessages(prev => prev.map(m => ({
      ...m,
      isSpeaking: m.id === message.id
    })));

    utterance.onend = utterance.onerror = () => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isSpeaking: false } : m
      ));
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setTtsError('Failed to read message');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const clearChatHistory = async () => {
    try {
      await fetch(LOGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: '',
      });
      setMessages([{
        id: '1',
        role: 'bot',
        content: 'Hello! I am your legal assistant. Ask me anything about Indian law.',
        timestamp: new Date(),
        isSpeaking: false
      }]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast.error('Failed to clear history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || connectionError) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      isSpeaking: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.response || "I couldn't process that request.",
        timestamp: new Date(),
        isSpeaking: false
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConnectionError(false);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: 'Failed to connect to the server. Please try again later.',
        timestamp: new Date(),
        isSpeaking: false
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnectionError(true);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
        <header className="text-center mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-10">Legal AI Assistant</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ask questions about Indian law
              </p>
            </div>
            
          </div>
          
          {connectionError && (
            <div className="text-red-500 flex items-center justify-center gap-1 mt-2">
              <AlertCircle size={16} /> Cannot connect to server
            </div>
          )}
        </header>

        <div 
          ref={chatContainerRef}
          className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-y-auto flex flex-col"
        >
          <div className="flex-1 p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-500 text-white' : 
                    message.role === 'error' ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : 
                     message.role === 'error' ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900 rounded-br-none' :
                    message.role === 'error' ? 'bg-red-100 dark:bg-red-900 rounded-bl-none' :
                    'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
                  }`}>
                    <p className="text-sm sm:text-base">{message.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'bot' && (
                        <button
                          onClick={() => toggleSpeak(message)}
                          className={`ml-2 p-1 rounded-full ${
                            message.isSpeaking 
                              ? 'bg-red-100 text-red-500 dark:bg-red-900/50' 
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          } hover:opacity-80 transition-opacity`}
                          aria-label={message.isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          {message.isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[90%] flex gap-2">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your legal question..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                disabled={isTyping || connectionError}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputValue.trim() || isTyping || connectionError}
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              Note: For actual legal matters, please consult a qualified lawyer.
            </p>
          </div>
        </div>

        {ttsError && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 shadow-lg z-50">
            <AlertCircle size={16} />
            <span>{ttsError}</span>
            <button 
              onClick={() => setTtsError(null)} 
              className="ml-2 text-red-700 hover:text-red-900 focus:outline-none"
              aria-label="Dismiss error"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;