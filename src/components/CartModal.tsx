import { X } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function CartModal({ cart, onClose, onRemove }: CartModalProps) {
  const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, '')), 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
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
        
        <div className="mt-6 pt-6 border-t font-bold text-xl flex justify-between">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
