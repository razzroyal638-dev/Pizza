import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ProfileModal from './ProfileModal';
import MenuItemCard from './MenuItemCard';
import CartModal from './CartModal';
import { User, ShoppingCart, Home, Phone, MessageSquare, Search, ArrowLeft, Mic, ChevronUp, ChevronDown, Instagram, Facebook } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

// Interfaces

const SHEET_ID = '1Hc2UnDjII-BHS0bKzXdHfJOhue5aMALwYCMzuEmA-NY';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export default function MenuApp() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Check localStorage
    const savedUser = localStorage.getItem('pizzaUser');
    if (savedUser) {
        setUserName(JSON.parse(savedUser).name);
    }

    async function fetchMenuData() {
      try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setMenuData(parsedData);
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pizzaUser');
    setUserName(null);
  };

  const addToCart = (name: string, variant: string, price: string) => {
    setCart([...cart, { id: Date.now().toString(), name, variant, price }]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        console.log("Transcript:", transcript);
        // Replace commas, plus signs, and periods with spaces, then trim
        setSearchTerm(transcript.replace(/[,\+\.]/g, ' ').trim());
    };
    
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
            alert("Microphone permission denied. Please enable it in your browser settings to use voice search.");
        } else {
            alert("Speech recognition error: " + event.error);
        }
    };
    
    recognition.start();
  };

  // Parser functions
  function parseCSVLine(line: string): string[] {
    let values = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        values.push(current.replace(/^"|"$/g, '').trim());
        current = '';
      } else current += char;
    }
    values.push(current.replace(/^"|"$/g, '').trim());
    return values;
  }

  function parseCSV(text: string): MenuItem[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const result: MenuItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 2) {
        result.push({
          category: values[0] || 'Other',
          name: values[1] || '',
          description: values[2] || '',
          regular: values[3] || '',
          medium: values[4] || '',
          large: values[5] || '',
          single: values[6] || '',
          'image Sq id': values[7] || ''
        });
      }
    }
    return result;
  }

  // Derived state
  const categories = ['ALL', ...new Set(menuData.map(item => item.category))];
  
  const filteredData = menuData.filter(item => {
    const matchesCat = (activeCategory === 'ALL' || item.category === activeCategory);
    
    // Split search term into keywords
    const keywords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    
    // Check if any keyword matches name or description (OR logic for keywords)
    const matchesSearch = keywords.length === 0 || keywords.some(keyword => 
        item.name.toLowerCase().includes(keyword) || 
        item.description.toLowerCase().includes(keyword)
    );
    
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
        <header className="bg-red-950 text-white shadow-2xl relative border-b-4 border-yellow-600 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1920&auto=format&fit=crop" 
                    alt="Delicious Pizza Background" 
                    className="w-full h-full object-cover opacity-30"
                    referrerPolicy="no-referrer"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/60 to-transparent"></div>
            </div>
            <div className="relative z-10 text-center py-8">
                <div className="absolute top-4 left-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="text-yellow-500 hover:text-white transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>
                <div className="absolute top-4 right-4">
                    <button 
                        onClick={() => setIsProfileOpen(true)}
                        className="bg-yellow-600 text-red-950 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest hover:bg-yellow-500 transition shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px]"
                    >
                        Premium Login
                    </button>
                </div>
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-5xl font-serif text-yellow-500 mt-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
                >
                    BarbieCorn Pizza
                </motion.h1>
                <p className="text-yellow-600 italic mt-2 font-serif text-lg tracking-wide">Live Digital Menu Catalog</p>
                <p className="text-white text-xs uppercase tracking-[0.2em] mt-4 font-bold bg-black/20 inline-block px-4 py-1 rounded-full">Tap to explore our golden menu!</p>
            </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Search bar */}
            <div className="w-full max-w-2xl mx-auto mb-8 relative">
                <input 
                    id="searchInput"
                    type="text" 
                    value={searchTerm}
                    placeholder="Search menu items (e.g. Margherita, Pepperoni)..." 
                    className="w-full p-4 pl-6 pr-24 rounded-full outline-none text-lg shadow-lg border border-gray-200 focus:ring-2 focus:ring-yellow-600"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button id="micBtn" className="absolute right-16 top-4 text-gray-400 hover:text-red-950" onClick={startVoiceSearch}>
                    <Mic size={24} className={isListening ? 'text-red-500 animate-pulse' : ''} />
                </button>
                <button className="absolute right-4 top-4 text-gray-400">
                    <Search size={24} />
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${activeCategory === cat ? 'bg-red-950 text-yellow-500 border-yellow-600 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-red-950'} font-bold uppercase text-sm`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-600">Loading Menu...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} id={`item-${item.name}`}>
                           <MenuItemCard item={item} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            )}
        </div>
        {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} onProfileCreated={setUserName} userName={userName} onLogout={handleLogout} />}
        {isCartOpen && <CartModal cart={cart} onClose={() => setIsCartOpen(false)} onRemove={removeFromCart} />}
        
        {/* Top/Bottom scroll buttons */}
        <div className="fixed right-4 bottom-32 flex flex-col gap-2 z-40">
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white p-2 rounded-full shadow-lg border border-blue-900 text-gray-700 hover:bg-gray-100"
            >
                <ChevronUp size={24} />
            </button>
            <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-white p-2 rounded-full shadow-lg border border-blue-900 text-gray-700 hover:bg-gray-100"
            >
                <ChevronDown size={24} />
            </button>
        </div>
        
        {/* Contact Section */}
        <div className="text-center py-8 my-8 mx-4 bg-blue-50 border-2 border-blue-900 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="flex flex-col items-center gap-4">
                <a href="tel:+919719944469" className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition">
                    <Phone size={18} />
                    <span>+91 97199 44469</span>
                </a>
                <a href="https://wa.me/919719944469" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full hover:bg-green-200 transition">
                    <MessageSquare size={18} />
                    <span>WhatsApp Us</span>
                </a>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="text-blue-900 hover:text-blue-700">
                        <Facebook size={28} />
                    </a>
                    <a href="#" className="text-pink-600 hover:text-pink-400">
                        <Instagram size={28} />
                    </a>
                </div>
                <div className="mt-4">
                    <a 
                        href="https://barbiecornpizza.lovable.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition inline-block"
                    >
                        Download App
                    </a>
                </div>
                <div className="text-gray-600 mt-2 text-sm max-w-sm px-4">
                    <a 
                        href="https://www.google.com/maps/search/?api=1&query=Sargam+Rd,+opposite+Sargam+Theatre,+Siau,+Chandpur,+Uttar+Pradesh+246725" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-red-950 underline transition"
                    >
                        Sargam Rd, opposite Sargam Theatre, Siau, Chandpur, Uttar Pradesh 246725
                    </a>
                </div>
            </div>
        </div>
        
        {/* Bottom Navigation Bar */}
        <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around items-center shadow-lg z-50 px-4"
        >
            {[
                { name: 'Home', icon: Home, action: () => { setActiveCategory('ALL'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                { name: 'Cart', icon: ShoppingCart, action: () => setIsCartOpen(true) },
                { name: 'Profile', icon: User, action: () => setIsProfileOpen(true) }
            ].map((item) => (
                <button 
                    key={item.name} 
                    onClick={item.action} 
                    className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-700 p-2"
                >
                    <item.icon size={22} />
                    <span className="text-[10px] font-semibold">{item.name}</span>
                </button>
            ))}
        </motion.nav>
    </div>
  );
}
