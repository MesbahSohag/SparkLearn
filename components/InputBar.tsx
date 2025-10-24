import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to 'auto' to ensure it can both grow and shrink correctly
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Corresponds to inline style

      // Set the height to the scroll height, but cap it at the max height
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;

      // Show scrollbar only if content exceeds the max height
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [text]);

  return (
    <div className="flex items-end w-full gap-2 sm:gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about an electronic component..."
        className="flex-1 px-4 py-2 bg-slate-700 border-none rounded-xl resize-none focus:ring-0 focus:outline-none transition-shadow duration-200 text-gray-100 placeholder-slate-400"
        rows={1}
        style={{maxHeight: '200px'}}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-600 text-white hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
