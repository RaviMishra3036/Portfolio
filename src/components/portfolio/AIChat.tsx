import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, RefreshCw, Send, X } from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  text: string;
}

const quickPrompts = ['Services?', 'Projects?', 'Contact Ravi'];
const initialMessages: ChatMessage[] = [
  { id: 1, role: 'assistant', text: 'Hi! I\'m Ravi\'s AI assistant. How can I help?' },
];

function getReply(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('service')) {
    return 'Ravi works on Java, Spring Boot, backend APIs, full-stack applications, and cloud-ready software.';
  }

  if (normalizedMessage.includes('project')) {
    return 'You can explore Ravi\'s featured projects in the Projects section of this portfolio.';
  }

  if (normalizedMessage.includes('contact') || normalizedMessage.includes('hire')) {
    return 'Please use the contact form below to get in touch with Ravi.';
  }

  return 'I can help you learn about Ravi\'s services, projects, skills, and contact details. What would you like to know?';
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = (message = input) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isTyping) return;

    const messageId = Date.now();
    setMessages((currentMessages) => [...currentMessages, { id: messageId, role: 'user', text: trimmedMessage }]);
    setInput('');
    setIsTyping(true);
    replyTimerRef.current = setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: messageId + 1, role: 'assistant', text: getReply(trimmedMessage) },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const refreshChat = () => {
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    setMessages(initialMessages);
    setInput('');
    setIsTyping(false);
  };

  return (
    <div className="ai-chat-widget">
      {isOpen && (
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.72 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, mass: 0.7 }}
          className="ai-chat-panel"
          aria-label="AI chat window"
        >
          <header className="ai-chat-header">
            <div className="ai-chat-profile">
              <div className="ai-chat-profile-icon">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Ravi&apos;s AI Assistant</h2>
                <p className="ai-chat-status"><span /> Online</p>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button type="button" onClick={refreshChat} className="ai-chat-icon-button ai-chat-refresh-button" aria-label="Refresh chat">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="ai-chat-icon-button ai-chat-close-button" aria-label="Close AI chat">
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`ai-chat-message ${message.role === 'user' ? 'is-user' : ''}`}>
                <p className="ai-chat-bubble">{message.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="ai-chat-message">
                <p className="ai-chat-bubble ai-chat-typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </p>
              </div>
            )}
          </div>

          <div className="ai-chat-composer">
            <div className="ai-chat-quick-actions">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="ai-chat-input-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask something..."
                aria-label="Chat message"
                className="ai-chat-input"
              />
              <button type="submit" disabled={!input.trim() || isTyping} className="ai-chat-send" aria-label="Send message">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.section>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="ai-chat-launcher"
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <span className="ai-avatar-3d">
            <span className="ai-avatar-antenna"><i /></span>
            <span className="ai-avatar-visor"><i /><i /></span>
            <span className="ai-avatar-mouth" />
          </span>
        )}
      </motion.button>
    </div>
  );
}