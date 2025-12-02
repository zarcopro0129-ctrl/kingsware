
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '歡迎來到 Kingsware。請問有什麼可以協助您了解我們產品的嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      chatSessionRef.current = await createChatSession();
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const streamResult = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let botResponseText = '';
      setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        botResponseText += textChunk;

        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = botResponseText;
          }
          return newHistory;
        });
      }
      
      setMessages(prev => {
        const newHistory = [...prev];
        const lastMsg = newHistory[newHistory.length - 1];
        lastMsg.isStreaming = false;
        return newHistory;
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
        <div className="flex items-center gap-2 mb-4 text-neutral-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">智能管家</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[300px] mb-4">
            {messages.map((msg, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                    <div className={`text-[10px] uppercase tracking-wider mb-1 text-neutral-500 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                        {msg.role === 'user' ? '您' : 'Kingsware'}
                    </div>
                    <div className={`max-w-[90%] p-3 rounded-lg text-xs md:text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-white text-black' 
                        : 'bg-neutral-800 text-neutral-200'
                    }`}>
                        {msg.text}
                        {msg.isStreaming && <span className="inline-block w-1 h-3 ml-1 bg-neutral-400 animate-pulse"/>}
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="relative shrink-0">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="詢問規格、尺寸或功能..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors text-white placeholder-neutral-600"
            />
            <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-1 top-1 p-2 bg-white text-black rounded-full hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
                <Send className="w-3 h-3" />
            </button>
        </div>
    </div>
  );
};

export default AIChat;
