import { useState } from 'react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (name: string, variant: string, price: string) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [showVariants, setShowVariants] = useState(false);

  const hasVariants = item.regular || item.medium || item.large;

  const handleAdd = (variant: string, price: string) => {
    onAddToCart(item.name, variant, price);
    setShowVariants(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-red-700 hover:shadow-md transition flex flex-col justify-between">
      <div>
        <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase mb-2">{item.category}</span>
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{item.description || 'Fresh & tasty'}</p>
      </div>

      <div className="mt-4">
        {showVariants ? (
          <div className="flex flex-col gap-2">
            {item.regular && <button onClick={() => handleAdd('Regular', item.regular)} className="bg-red-50 text-red-700 p-2 rounded text-sm hover:bg-red-100">Regular: {item.regular}</button>}
            {item.medium && <button onClick={() => handleAdd('Medium', item.medium)} className="bg-red-50 text-red-700 p-2 rounded text-sm hover:bg-red-100">Medium: {item.medium}</button>}
            {item.large && <button onClick={() => handleAdd('Large', item.large)} className="bg-red-50 text-red-700 p-2 rounded text-sm hover:bg-red-100">Large: {item.large}</button>}
          </div>
        ) : (
          <button 
            onClick={() => hasVariants ? setShowVariants(true) : handleAdd('Single', item.single)} 
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            {hasVariants ? 'Add to Cart' : `Add: ${item.single}`}
          </button>
        )}
      </div>
    </div>
  );
}
