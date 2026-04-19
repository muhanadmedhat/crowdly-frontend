import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Trash2, User, Mail, Shield } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Backend mapping: path('', AdminsView.as_view()) in accounts/urls.py
      const { data } = await api.get('/users/');
      setUsers(data.results || data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}/`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch {
      toast.error('Error deleting user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">User Management</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">View and manage all registered users on the platform.</p>
      </div>

      <div className="card p-6 mb-8 ghost-border">
        <div className="relative max-w-sm">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-text-secondary)]">Loading users...</div>
      ) : (
        <div className="card ghost-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] label-md font-semibold border-b border-[var(--color-border-secondary)]">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-tertiary)] bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                        {user.first_name?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {user.first_name} {user.last_name}
                        </div>
                        {user.is_staff && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            <Shield size={10} /> Staff
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Mail size={14} /> {user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
