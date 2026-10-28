import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Layers, Plus, Trash2, Tag, CheckCircle2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, setCategories, products, showToast } = useData();

  const [newCatName, setNewCatName] = useState('');
  const [newCatDiscount, setNewCatDiscount] = useState('Up to 25% OFF');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      discount: newCatDiscount,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=60'
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    showToast(`Category "${newCat.name}" added to platform!`);
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    showToast('Category removed from active taxonomy', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Healthcare Categories &amp; Taxonomy</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage product categorizations, promotional discount tags, and navigation filters
          </p>
        </div>
      </div>

      {/* Add New Category Box */}
      <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
          <Plus className="w-4 h-4 mr-1.5 text-teal-700" />
          Add New Medicine Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-gray-700 block mb-1">Category Name</label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Ayurvedic Immunity &amp; Herbs"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Discount Tag</label>
            <input
              type="text"
              value={newCatDiscount}
              onChange={(e) => setNewCatDiscount(e.target.value)}
              placeholder="Up to 30% OFF"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer"
          >
            Create Category
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <div
              key={cat.id || cat.name}
              className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between hover:border-teal-300 transition"
            >
              <div>
                <h3 className="text-xs font-extrabold text-gray-900">{cat.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded">
                    {cat.discount || 'Standard'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {count} products listed
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleRemoveCategory(cat.id)}
                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
