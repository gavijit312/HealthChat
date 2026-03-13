'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RotateCcw } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ThemeToggle from './ThemeToggle';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_URL =  'https://healthcare-backend-nec1.onrender.com';

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hc_username');
      if (stored) setUserName(stored);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!userName) return;
    setShowWelcome(true);
    const id = window.setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(id);
  }, [userName]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    const timeoutMs = 15000; // 15s timeout, adjust as needed
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // personalize any backend greeting that mentions "Avijit"
      const rawText: string = data.response || '';
      const personalized = userName
        ? rawText.replace(/avijit/gi, userName)
        : rawText.replace(/avijit/gi, '');

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: personalized,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Error sending message:', err);
      const isTimeout = err?.name === 'AbortError';
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: isTimeout
          ? 'Server is taking too long to respond. Please try again.'
          : 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-background via-background to-muted/30">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Health Support AI</h1>
            <p className="text-sm text-muted-foreground">Your friendly health assistant</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto px-4 sm:px-6 py-2"
          >
            <div className="rounded-md bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-primary-foreground text-center">
              Welcome back, {userName}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <motion.div
              className="h-full flex items-center justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                {userName ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Welcome, {userName}!</h2>
                    <p className="text-muted-foreground max-w-sm">
                      Start a conversation about your health and wellness. I'm here to provide helpful guidance.
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                    <p className="text-muted-foreground max-w-sm">
                      Enter your name so I can personalize responses for you.
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Your name"
                        className="px-3 py-2 rounded-md border"
                      />
                      <button
                        onClick={() => {
                          const trimmed = nameInput.trim();
                          if (!trimmed) return;
                          try {
                            localStorage.setItem('hc_username', trimmed);
                          } catch (e) {}
                          setUserName(trimmed);
                          setNameInput('');
                        }}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <>
              <MessageBubble key="placeholder" message="" isUser={false} isPlaceholder />
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <TypingIndicator />
              </motion.div>
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your health question..."
              disabled={loading}
              className="rounded-full border-primary/20 focus:border-primary"
            />
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              disabled={loading || !input.trim()}
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}

