import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Send, Bot, User, HelpCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const GeminiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your PACE Assistant. How can I help you navigate the platform today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // PACE Knowledge Base / System Prompt
      const systemPrompt = `You are the PACE (Progress & Academic Completion Engine) Assistant. 
      You help users navigate the PACE educational platform.
      Key Features of PACE:
      1. Superadmin Dashboard: For school owners to manage teachers, see school-wide performance, and invite new staff.
      2. Teacher Dashboard: For monitoring class performance, intervention management, and student registration.
      3. Student Registration: Teachers can bulk upload students via Excel/CSV or use Gemini AI to generate student profiles based on class lists.
      4. Intervention View: A special view for teachers to see exactly which students are "Stagnant" (Red), "Slowing Down" (Yellow), or "On Track" (Green).
      
      Always be helpful, professional, and concise. If a user asks how to do something, give them step-by-step instructions based on the dashboards we have.`;

      const genAI = new GoogleGenerativeAI("AIzaSyBX6X43f4Q3Pw7Zk-l5n-kRXoRBcDGtH1I");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `${systemPrompt}\n\nUser Question: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my brain right now. Please try again in a moment!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0, 209, 193, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Sparkles size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="animate-scale" style={{
          width: '380px',
          height: '500px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--color-border)'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot size={24} />
              <div style={{ fontWeight: '700' }}>PACE Assistant</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: msg.role === 'user' ? 'var(--color-primary)' : '#f0f4f8',
                color: msg.role === 'user' ? 'white' : 'var(--color-text-main)',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                position: 'relative'
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#f0f4f8', padding: '0.5rem 1rem', borderRadius: '15px', display: 'flex', gap: '4px' }}>
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              disabled={isTyping}
              style={{
                background: isTyping ? '#cbd5e1' : 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
