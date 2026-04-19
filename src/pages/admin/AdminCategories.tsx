import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Category {
  id?: number;
  name: string;
  description: string;
  image: string | null;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects/categories/');
      // Handle paginated response typically { results: [...] } or direct array
      setCategories(data.results || data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openModal = (cat?: Category) => {
    if (cat?.id) {
      setEditId(cat.id);
      setFormData({ name: cat.name, description: cat.description });
    } else {
      setEditId(null);
      setFormData({ name: '', description: '' });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editId) {
        await api.put(`/projects/categories/${editId}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/projects/categories/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category created successfully');
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Error saving category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/projects/categories/${id}/`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Error deleting category');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Categories</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage project categories available on the platform
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => openModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="card p-6 mb-8 ghost-border">
        <input
          type="text"
          placeholder="Search categories..."
          className="input max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-text-secondary)]">
          Loading categories...
        </div>
      ) : (
        <div className="card ghost-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] label-md font-semibold border-b border-[var(--color-border-secondary)]">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-tertiary)] bg-white">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                  <td className="p-4">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        None
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-[var(--color-text-primary)]">{cat.name}</td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)] max-w-md truncate">
                    {cat.description}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors mr-2"
                      onClick={() => openModal(cat)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => handleDelete(cat.id!)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[var(--radius-container)] shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
              {editId ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="input resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-surface-container)] file:text-[var(--color-primary)] hover:file:bg-[var(--color-surface-highest)]"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary text-[var(--color-text-primary)]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
