import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function CartModal({ cart, onClose, onRemove }: CartModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderType, setOrderType] = useState<'Home Delivery'>('Home Delivery');

  useEffect(() => {
    const storedData = localStorage.getItem('pizzaUser');
    if (storedData) {
      const user = JSON.parse(storedData);
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, '')), 0);

  const sendToWhatsApp = () => {
    const itemsText = cart.map(item => `${item.name} (${item.variant}) - ${item.price}`).join('\n');
    const message = `*New Order:*\n\n*Order Type:* ${orderType}\n*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Items:*\n${itemsText}\n\n*Total:* ₹${total}`;
    const whatsappUrl = `https://wa.me/919719944469?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-700">Order Type</label>
          <div className="flex gap-2">
            <button 
                className="flex-1 py-2 rounded-lg text-sm font-semibold border bg-orange-100 border-orange-500 text-orange-700"
            >
                Home Delivery
            </button>
          </div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer Name *" className="w-full p-3 rounded-xl border border-gray-300" />
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile Number *" className="w-full p-3 rounded-xl border border-gray-300" />
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address *" className="w-full p-3 rounded-xl border border-gray-300" />
        </div>

        <div className="space-y-4 max-h-48 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.variant}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span>{item.price}</span>
                  <button onClick={() => onRemove(item.id)} className="text-red-600">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t font-bold text-xl flex justify-between mb-6">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>

        <button 
          onClick={sendToWhatsApp}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Send Order to WhatsApp
        </button>
      </div>
    </div>
  );
}
