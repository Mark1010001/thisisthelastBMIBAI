import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, User, Bot, Loader2, MessageSquare, X } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const FloatingAICoach = ({ metrics, results }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const lastAdviceRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (results) {
      if (messages.length === 0) {
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm your AI Health Coach. Based on your data (BMI: ${results.bmi}, BAI: ${results.bai}%, Age: ${metrics.age}, Gender: ${metrics.gender}), I'm here to help you understand your metrics and provide guidance. How can I help you today?`
        }]);
        lastAdviceRef.current = results.coach_advice;
      } else if (results.coach_advice !== lastAdviceRef.current) {
        setMessages(prev => [...prev, { role: 'assistant', content: `📊 I've updated my assessment: ${results.coach_advice}` }]);
        lastAdviceRef.current = results.coach_advice;
      }
    }
  }, [results, metrics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/chat`, {
        message: userMsg,
        metrics,
        results
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-bg-card border border-border-dim rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-brand flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-black rounded-lg text-brand">
                <Bot size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-black text-black uppercase tracking-tight">AI Health Coach</h3>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <span className="text-[9px] font-bold text-black/70 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-black/10 rounded-full transition-colors text-black"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Live Assessment - Always at top */}
          {results?.coach_advice && (
            <div className="p-3 bg-brand/10 border-b border-brand/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-md bg-brand text-black">
                  <Sparkles size={10} strokeWidth={3} />
                </div>
                <p className="text-[9px] font-black text-text-header uppercase tracking-wider">Live Assessment</p>
              </div>
              <p className="text-[11px] leading-relaxed text-text-main font-medium italic">
                "{results.coach_advice}"
              </p>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-bg-main/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-brand text-black font-bold rounded-tr-none'
                    : 'bg-bg-card border border-border-dim text-text-main font-medium rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1 opacity-60">
                    {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    <span className="text-[9px] uppercase tracking-wider font-black">
                      {msg.role === 'user' ? 'You' : 'AI Coach'}
                    </span>
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-bg-card border border-border-dim text-text-main rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm">
                  <Loader2 size={14} className="animate-spin text-brand" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border-dim bg-bg-card">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your health coach..."
                className="w-full bg-bg-input border border-border-dim rounded-xl py-3 pl-4 pr-12 text-[12px] font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-text-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand text-black rounded-lg disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20"
              >
                <Send size={14} strokeWidth={3} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-bg-card border border-border-dim text-brand rotate-90' : 'bg-brand text-black hover:scale-110'
        }`}
      >
        {isOpen ? <X size={24} strokeWidth={2.5} /> : <MessageSquare size={24} strokeWidth={2.5} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-bg-main rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingAICoach;
