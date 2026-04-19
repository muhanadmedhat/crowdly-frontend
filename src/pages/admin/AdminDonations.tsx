import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { DollarSign, Trash2, Calendar, User, Briefcase } from 'lucide-react';

interface Donation {
  id: number;
  donor_email?: string;
  project_title?: string;
  amount: string;
  created_at: string;
  donor: { email: string; first_name: string; last_name: string };
  project: { title: string };
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/donations/admin/');
      setDonations(data.results || data);
    } catch {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDeleteDonation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) return;
    try {
      await api.delete(`/donations/admin/${id}/`);
      toast.success('Donation record deleted');
      fetchDonations();
    } catch {
      toast.error('Error deleting donation');
    }
  };

  const filteredDonations = donations.filter(d => 
    d.donor?.email.toLowerCase().includes(search.toLowerCase()) || 
    d.project?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Donation Management</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Monitor all financial contributions across projects.</p>
      </div>

      <div className="card p-6 mb-8 ghost-border">
        <div className="relative max-w-sm">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by donor or project..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-text-secondary)]">Loading donations...</div>
      ) : (
        <div className="card ghost-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] label-md font-semibold border-b border-[var(--color-border-secondary)]">
                <th className="p-4">Donor</th>
                <th className="p-4">Project</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-tertiary)] bg-white">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        {donation.donor?.first_name} {donation.donor?.last_name}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">{donation.donor?.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                      <Briefcase size={14} className="text-gray-400" />
                      <span className="truncate max-w-[200px]">{donation.project?.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600">
                      LE {parseFloat(donation.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} />
                       {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => handleDeleteDonation(donation.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No donations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
