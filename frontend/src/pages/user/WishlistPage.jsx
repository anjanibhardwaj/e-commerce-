import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function WishlistPage() {
  const { wishlist, products, addToCart, toggleWishlist } = useData();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
        <Heart className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-base font-bold text-gray-800">Your Wishlist is Empty</h3>
        <p className="text-xs text-gray-500">Save medicines and health supplements to buy later.</p>
        <Link to="/products" className="inline-block bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900">Saved Wishlist ({wishlistProducts.length})</h2>
        <p className="text-xs text-gray-500 mt-0.5">Quickly order your recurring wellness supplies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-400 transition"
          >
            <div>
              <div className="w-full h-36 bg-gray-50 rounded-2xl p-2 flex items-center justify-center mb-3">
                <img src={p.image} alt={p.name} className="h-full object-contain" />
              </div>
              <span className="text-[10px] text-teal-700 font-bold uppercase">{p.brand}</span>
              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mt-0.5">{p.name}</h3>
              <div className="text-sm font-black text-gray-900 mt-2">{formatCurrency(p.price)}</div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => addToCart(p)}
                className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
              <button
                onClick={() => toggleWishlist(p.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
