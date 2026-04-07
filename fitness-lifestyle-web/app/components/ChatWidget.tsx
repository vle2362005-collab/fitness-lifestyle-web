"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import apiClient from '@/services/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'ai'|'user', text: string}[]>([
    { sender: 'ai', text: 'Chào bạn! Mình là Trợ lý TrueForm. Mình có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/Chat/ask', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Hệ thống AI đang bận. Vui lòng thử lại sau!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center text-cyan-400">
            <div className="flex items-center font-bold gap-2"><Bot size={20}/> TrueForm AI</div>
            <button onClick={() => setIsOpen(false)} className="hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-500 text-xs flex items-center gap-2"><Bot size={14} className="animate-pulse"/> AI đang gõ...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Hỏi AI cách giảm cân..." className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 text-sm text-white focus:outline-none focus:border-cyan-500" />
            <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full"><Send size={16}/></button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center animate-bounce">
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}