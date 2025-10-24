import React from 'react';
import { Role } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatBubbleProps {
  role: Role;
  content: string;
  isLoading?: boolean;
  isError?: boolean;
}

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, isLoading = false, isError = false }) => {
  const isModel = role === 'model';

  const bubbleClasses = isModel
    ? isError
      ? 'bg-red-900/40 text-red-200 border border-red-500/30'
      : 'bg-gray-800 text-gray-200'
    : 'bg-cyan-700/50 text-white';
  
  const processContent = (text: string): string => {
    // 1. Isolate code blocks and escape their content.
    const codeBlocks: string[] = [];
    let processedText = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      codeBlocks.push(escapeHtml(code.trim()));
      return `\n%%CODEBLOCK_${codeBlocks.length - 1}%%\n`;
    });

    // 2. Escape the rest of the content to prevent XSS.
    processedText = escapeHtml(processedText);

    // 3. Apply markdown formatting safely to the escaped text.
    // **Bold/Italic**
    processedText = processedText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // **Lists (improved)**
    processedText = processedText.replace(/^((?:^- .*(?:\n|$))+)/gm, (match) => {
      const items = match.trim().split('\n').map(item => `<li>${item.substring(2).trim()}</li>`).join('');
      return `<ul>${items}</ul>`;
    });

    // 4. Split content into paragraphs, respecting block elements.
    const paragraphs = processedText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    
    let html = paragraphs.map(p => {
        if (p.startsWith('<ul>') || p.includes('%%CODEBLOCK')) {
            return p;
        }
        return `<p>${p.replace(/\n/g, '<br />')}</p>`;
    }).join('');

    // 5. Restore the code blocks with their safe, escaped content.
    codeBlocks.forEach((block, index) => {
      const placeholder = `%%CODEBLOCK_${index}%%`;
      const codeHtml = `<pre class="bg-gray-900/70 p-3 rounded-lg my-2 text-sm text-gray-300 whitespace-pre-wrap break-words"><code>${block}</code></pre>`;
      html = html.replace(`<p>${placeholder}</p>`, codeHtml).replace(placeholder, codeHtml);
    });
    
    return html;
  };

  const formattedContent = processContent(content);

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in`}>
      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-gray-700' : 'bg-cyan-800'}`}>
        {isModel ? <LogoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> : <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      </div>
      <div className={`flex-1 p-3 sm:p-4 rounded-xl rounded-tl-none ${bubbleClasses} overflow-hidden`}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            <span className="text-gray-400">{content}</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none break-words" dangerouslySetInnerHTML={{ __html: formattedContent }} />
        )}
      </div>
    </div>
  );
};
