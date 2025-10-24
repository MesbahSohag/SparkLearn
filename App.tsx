import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { InputBar } from './components/InputBar';
import { Message, Role } from './types';
import { getSparkLearnResponse } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "What is a resistor?",
    "Explain the ESP32 microcontroller.",
    "How do I use a capacitor in a power supply?",
    "What's a simple project with an LED?",
  ];

  useEffect(() => {
    setMessages([
      {
        role: 'model',
        content: "Hello! I'm SparkLearn, your AI electronics tutor from Spark Sync. What component or concept would you like to explore today? For example, you can ask me about resistors, the ESP32, or how a capacitor works!"
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    if (isFirstInteraction) {
      setIsFirstInteraction(false);
    }

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const modelResponse = await getSparkLearnResponse(newMessages);
      const modelMessage: Message = { role: 'model', content: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error("Failed to send message:", e);
      const userFriendlyError = "I'm having a little trouble connecting right now. Please check that your API key is correctly configured and that you have a stable internet connection. If the problem persists, please try again in a moment.";
      setError("An error occurred. Please try again.");
      const errorModelMessage: Message = { role: 'model', content: userFriendlyError, isError: true };
      setMessages(prev => [...prev, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg, index) => (
            <ChatBubble key={index} role={msg.role} content={msg.content} isError={msg.isError} />
          ))}
          {isLoading && <ChatBubble role="model" content="SparkLearn is thinking..." isLoading={true} />}
          {isFirstInteraction && messages.length === 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 animate-fade-in">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-gray-700/50 hover:bg-gray-700 text-sm text-gray-200 px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <div className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm pt-2 pb-4 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
          <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;
