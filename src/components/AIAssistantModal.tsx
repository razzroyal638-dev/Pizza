import { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAssistantModalProps {
  onClose: () => void;
  onItemClick: (name: string, variant: string, price: string) => void;
  menuData: any[];
}

interface AIResponse {
  message: string;
  items: { 
    name: string, 
    description: string, 
    price: string,
    regular?: string,
    medium?: string,
    large?: string
  }[];
}

export default function AIAssistantModal({ onClose, onItemClick, menuData }: AIAssistantModalProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', data: AIResponse}[]>([
    { role: 'ai', data: { message: "Namaste! 🙏 I am your BarbieCorn Pizza Assistant. What are you craving today?", items: [] } }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', data: { message: input, items: [] } }]);
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, menuData }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }
      const aiResponse: AIResponse = data;
      setMessages(prev => [...prev, { role: 'ai', data: aiResponse }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'ai', data: { message: e.message || "Sorry, I'm having trouble connecting.", items: [] } }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
      >
        <div className="bg-green-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Sparkles />
                <div>
                    <h2 className="font-bold">BarbieCorn AI Assistant</h2>
                    <p className="text-xs opacity-90">Smart Search & Recommendations</p>
                </div>
            </div>
            <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-gray-100 ml-auto max-w-[80%]' : 'bg-green-50 mr-auto w-full'}`}>
                    <p className="mb-2">{m.data.message}</p>
                    {m.data.items && m.data.items.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {m.data.items.map((item, j) => (
                                <div key={j} className="bg-white p-2 rounded shadow-sm text-sm">
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                                    {(item.regular || item.medium || item.large) ? (
                                        <div className="flex flex-col gap-1">
                                            {item.regular && <button onClick={() => onItemClick(item.name, 'Regular', item.regular!)} className="bg-red-50 text-red-700 p-1 rounded text-xs hover:bg-red-100">Regular: {item.regular}</button>}
                                            {item.medium && <button onClick={() => onItemClick(item.name, 'Medium', item.medium!)} className="bg-red-50 text-red-700 p-1 rounded text-xs hover:bg-red-100">Medium: {item.medium}</button>}
                                            {item.large && <button onClick={() => onItemClick(item.name, 'Large', item.large!)} className="bg-red-50 text-red-700 p-1 rounded text-xs hover:bg-red-100">Large: {item.large}</button>}
                                        </div>
                                    ) : (
                                        <button onClick={() => onItemClick(item.name, 'Single', item.price)} className="font-semibold text-red-700 w-full text-left">Add: {item.price}</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Thinking...</div>}
        </div>
        
        <div className="p-4 border-t flex gap-2">
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2"
                placeholder="Ask e.g. 'Show spicy pizzas...'"
            />
            <button onClick={sendMessage} className="bg-green-700 text-white p-2 rounded-full"><Send size={20} /></button>
        </div>
        <div className='text-center text-xs p-2 text-gray-400'>Powered by Gemini AI Engine</div>
      </motion.div>
    </div>
  );
}
