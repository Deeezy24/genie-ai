"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Lock, Send, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AuthModal from "../Reusable/AuthModal";

const mockMessages = [
  {
    sender: "bot",
    text: "Hi there! I'm your career assistant. I can help you improve your resume, practice interviews, and advance your career.",
    timestamp: "2:30 PM",
  },
  { sender: "user", text: "Can you help me optimize my resume for tech roles?", timestamp: "2:31 PM" },
  {
    sender: "bot",
    text: "Absolutely! I'd be happy to help optimize your resume for tech positions. Please upload your current resume and I'll provide personalized feedback and suggestions.",
    timestamp: "2:31 PM",
  },
];

const ChatInterfaceSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const closeAuthModal = () => setShowAuthModal(false);

  const handleSendClick = () => {
    if (inputValue.trim()) {
      setShowAuthModal(true);
      setInputValue("");
    }
  };

  useEffect(() => {
    // Simulate typing indicator
    const timer = setTimeout(() => setIsTyping(true), 1000);
    const stopTyping = setTimeout(() => setIsTyping(false), 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(stopTyping);
    };
  }, []);

  return (
    <section id="chat" className="px-4 py-20 relative bg-zinc-800/25 overflow-hidden z-50">
      <div className="absolute inset-0 bg-black/10 -z-10"></div>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/10 via-zinc-800/10 to-zinc-900/10"></div>
      <div className="absolute top-42 left-10 w-72 h-72 bg-gradient-to-r from-zinc-900/20 to-zinc-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-zinc-900/20 to-zinc-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Chat With Your AI Assistant
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Get personalized career guidance, resume optimization, and interview preparation.
            <span className="text-blue-400 font-medium"> Sign in to unlock full features.</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 border-b border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold text-white">Geinie</h3>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Messages Container */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-zinc-900/50 to-zinc-800/50">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.text}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                    style={{ animationDelay: `${msg.text.length * 0.2}s` }}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {msg.sender === "bot" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-lg ${
                          msg.sender === "bot"
                            ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-zinc-800 border border-zinc-700/50 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-zinc-900/80 border-t border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about your career... (e.g., 'Improve my resume for tech roles')"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-200"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border border-zinc-600 transition-all duration-200"
                      size="lg"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={handleSendClick}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 mt-3 text-center">
                  🔒 Sign in to send messages and upload files • Your data is secure and encrypted
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Resume Analysis", "Interview Prep", "Career Guidance", "Skill Assessment"].map((feature, index) => (
              <div
                key={feature}
                className="px-4 py-2 bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 rounded-full text-sm text-zinc-300 hover:bg-zinc-700/60 transition-all duration-200 cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        title="Sign in to Continue"
        description="Sign in to upload your CV and get personalized AI insights."
        onCancel={closeAuthModal}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default ChatInterfaceSection;
