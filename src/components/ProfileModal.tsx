import { useState } from 'react';
import { X, User, Phone, MapPin, Hash, Lock } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
  onProfileCreated: (name: string) => void;
  userName: string | null;
  onLogout: () => void;
}

export default function ProfileModal({ onClose, onProfileCreated, userName, onLogout }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
      console.log("Registering...", { name, phone });
      const userData = { name, phone: phone.trim(), address, pincode, password };
      localStorage.setItem('pizzaUser', JSON.stringify(userData));
      onProfileCreated(name);
    
    setName('');
    setPhone('');
    setAddress('');
    setPincode('');
    setPassword('');
    onClose();
  };

  if (userName) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Hello, {userName}!</h2>
                <button 
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white"><X size={24} /></button>
          <h2 className="text-2xl font-bold">Welcome to BarbieCorn Pizza</h2>
          <p className="text-sm opacity-90 mt-2">Create an account or login to track your fine-dining table booking, request fresh pizzas, and order 100% tasty meals.</p>
        </div>

        <div className="p-6 space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (e.g. Manish Royal)" 
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                />
              </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contact Number (10-digit mobile number)" 
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            />
          </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery Address" 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
              />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pin Code (6 digits)" 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
              />
            </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6-digit Password Pin" 
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition mt-4"
          >
            Create Customer Account
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
            100% Secure & Private Local Storage
        </div>
      </div>
    </div>
  );
}
