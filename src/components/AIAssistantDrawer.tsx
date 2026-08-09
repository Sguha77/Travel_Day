import React, { useState } from 'react';
import { Trip, AssistantMessage } from '../types';
import { X, Sparkles, Send, Coffee, ShieldAlert, Compass, HelpCircle } from 'lucide-react';

interface AIAssistantDrawerProps {
  trip: Trip | null;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({ trip, onClose }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: trip
        ? `Hello! I'm your Travel Day AI companion. I've loaded your ${trip.eventType} ${trip.identifier} details to ${trip.destinationCode}. How can I assist your journey today?`
        : "Hello! I'm your Travel Day AI companion. Ask me any travel questions, security wait time estimates, or airport terminal tips!",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'How early should I arrive with bags?',
    `Where is coffee near ${trip?.gate || 'Gate G12'}?`,
    'What are the carry-on liquid limits?',
    'What is the baggage claim policy?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/travel-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, trip }),
      });
      const data = await res.json();

      const aiMsg: AssistantMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "I'm here to help navigate your travel day seamlessly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          sender: 'ai',
          text: 'Make sure to have your ID and boarding pass ready, and check airport display screens for real-time gate announcements.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-[#ffffff] dark:bg-[#212123] w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 border-l border-[#c1c6d7] dark:border-[#414755]">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#c1c6d7] dark:border-[#414755] flex items-center justify-between bg-[#fcf8fb] dark:bg-[#1b1b1d]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f7fff2] dark:bg-[#00531c]/50 text-[#006b27] dark:text-[#53e16f] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1b1b1d] dark:text-[#f3f0f2]">
                Travel Day AI Companion
              </h3>
              <p className="text-[11px] text-[#717786] dark:text-[#8b91a0]">
                Gemini 3.6-flash • Live Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f0edef] dark:hover:bg-[#2f2f32] text-[#414755] dark:text-[#c1c6d7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#f6f3f5] dark:bg-[#28282a] border-b border-[#c1c6d7] dark:border-[#414755] flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-medium px-3 py-1.5 bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] text-[#0058bc] dark:text-[#adc6ff] rounded-full whitespace-nowrap hover:bg-[#d8e2ff] dark:hover:bg-[#004493] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0058bc] text-white rounded-br-none font-medium'
                    : 'bg-[#f0edef] dark:bg-[#2f2f32] text-[#1b1b1d] dark:text-[#f3f0f2] rounded-bl-none border border-[#c1c6d7] dark:border-[#414755]'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#717786] dark:text-[#8b91a0] mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#717786] dark:text-[#8b91a0] italic p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#0058bc]" />
              <span>Checking terminal database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#c1c6d7] dark:border-[#414755] bg-[#ffffff] dark:bg-[#212123]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask travel day AI anything..."
              className="flex-1 bg-[#f6f3f5] dark:bg-[#28282a] border border-[#c1c6d7] dark:border-[#414755] rounded-xl px-3 py-2 text-xs text-[#1b1b1d] dark:text-[#f3f0f2] focus:outline-none focus:border-[#0058bc]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 bg-[#0058bc] text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
