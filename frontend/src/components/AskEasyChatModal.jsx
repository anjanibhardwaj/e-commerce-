import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AskEasyChatModal({ isOpen, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! 🙏 I am AskEasy, your PharmEasy Health Assistant. How can I help you today?",
      options: ["Book a Lab Test", "Upload Prescription", "Common Fever Medicines", "Delivery status"]
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let botReply = {
        sender: "bot",
        text: "I understand! Let me assist you right away.",
        options: []
      };

      const lower = query.toLowerCase();
      if (lower.includes("lab") || lower.includes("test") || lower.includes("checkup")) {
        botReply.text = "We offer over 84+ certified Thyrocare diagnostic packages right at home with free sample pickup. Our Comprehensive Full Body Checkup is currently 52% off at ₹2199!";
        botReply.action = { label: "View Lab Tests", target: "#lab-tests" };
      } else if (lower.includes("prescription") || lower.includes("upload")) {
        botReply.text = "You can upload a photo of your doctor's prescription in 1 click! Our licensed pharmacists will verify the dosage and prepare your doorstep medicine order.";
        botReply.action = { label: "Upload Prescription", target: "prescription-modal" };
      } else if (lower.includes("fever") || lower.includes("dolo") || lower.includes("paracetamol")) {
        botReply.text = "For mild fever and body aches, Dolo 650 is widely prescribed by doctors. Take it after meals with plenty of water. If fever persists over 3 days, please consult a physician.";
      } else if (lower.includes("delivery") || lower.includes("order")) {
        botReply.text = "PharmEasy delivers across 19,000+ pin codes in India within 24-48 hours. Express delivery is also available in metro cities!";
      } else {
        botReply.text = "Thanks for asking! You can search our medical catalog of 60,000+ medicines, consult a verified doctor from ₹199, or book home lab tests anytime.";
        botReply.options = ["Lab Tests", "Upload Prescription", "Plus Membership"];
      }

      setMessages(prev => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Bot Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-teal-100 backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center">
              <span>AskEasy Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2 animate-ping" />
            </div>
            <div className="text-[10px] text-teal-200">AI Health Advisor &amp; Support</div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 ${
              m.sender === 'user' 
                ? 'bg-teal-700 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              
              {m.action && (
                <button 
                  onClick={() => {
                    if (onNavigate) onNavigate(m.action.target);
                    onClose();
                  }}
                  className="mt-2 inline-flex items-center space-x-1 bg-teal-50 text-teal-800 font-bold px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
                >
                  <span>{m.action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {m.options && m.options.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.options.map((opt, oIdx) => (
                    <button 
                      key={oIdx}
                      onClick={() => handleSend(opt)}
                      className="bg-gray-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-semibold text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about medicines or tests..."
          className="flex-1 text-xs px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600"
        />
        <button 
          type="submit"
          className="bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-xl transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
