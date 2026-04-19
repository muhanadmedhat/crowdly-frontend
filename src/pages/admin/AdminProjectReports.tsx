import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProjectReport {
  id: number;
  project_title?: string;
  reason: string;
  status: string;
  created_at: string;
  reporter?: { email: string };
}

export default function AdminProjectReports() {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ProjectReport | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/interactions/projects/');
      setReports(data.results || data);
    } catch {
      toast.error('Failed to load project reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, []);

  const openActionModal = (report: ProjectReport, type: 'approve' | 'reject') => {
    setSelectedReport(report);
    setActionType(type);
    setAdminNotes('');
    setIsModalOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      await api.patch(`/admin-panel/reports/projects/${selectedReport.id}/`, {
        action: actionType,
        admin_notes: adminNotes,
      });
      toast.success(`Report ${actionType}d successfully`);
      setIsModalOpen(false);
      fetchReports();
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || `Failed to ${actionType} report`);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Project Reports</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Review and manage pending reports on projects.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-text-secondary)]">Loading reports...</div>
      ) : (
        <div className="card ghost-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] label-md font-semibold border-b border-[var(--color-border-secondary)]">
                <th className="p-4">Project / Object</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-tertiary)] bg-white">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-text-primary)]">
                    {report.project_title || `Project #${report.id}`}
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{report.reporter?.email || 'Unknown'}</td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)] max-w-sm truncate">{report.reason}</td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                    {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors mr-2" title="Approve Report" onClick={() => openActionModal(report, 'approve')}>
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Reject Report" onClick={() => openActionModal(report, 'reject')}>
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No pending project reports.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[var(--radius-container)] shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-2xl font-bold mb-2 text-[var(--color-primary)] capitalize">{actionType} Report</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              You are about to <strong className={actionType === 'approve' ? 'text-green-600' : 'text-red-600'}>{actionType}</strong> the report for '{selectedReport.project_title || `Project #${selectedReport.id}`}'.
            </p>
            <form onSubmit={handleAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Admin Notes (Required)</label>
                <textarea
                  required
                  rows={4}
                  className="input resize-none"
                  placeholder="Provide a reason for this action..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-[var(--color-text-primary)]">Cancel</button>
                <button type="submit" className={`btn-primary ${actionType === 'approve' ? '!bg-green-600 hover:!bg-green-700' : '!bg-red-600 hover:!bg-red-700'}`}>
                  Confirm {actionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
