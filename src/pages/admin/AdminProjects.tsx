import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, XCircle, Search, Filter, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  total_target: string;
  total_donated: string;
  status: string;
  is_cancelled: boolean;
  category_name?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const { data } = await api.get(`/projects/?${params.toString()}`);
      setProjects(data.results || data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleCancelProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this project? This will mark it as cancelled on the platform.')) return;
    try {
      await api.patch(`/projects/${id}/cancel/`);
      toast.success('Project cancelled successfully');
      fetchProjects();
    } catch {
      toast.error('Error cancelling project');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Project Management</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Review, monitor and moderate all projects live on the platform.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="card p-4 ghost-border flex-1 flex items-center gap-3">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search projects by title, tags or owner..."
            className="bg-transparent border-none outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card p-4 ghost-border flex items-center gap-3 min-w-[200px]">
          <Filter className="text-gray-400" size={18} />
          <select 
            className="bg-transparent border-none outline-none w-full text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-text-secondary)]">Loading projects...</div>
      ) : (
        <div className="card ghost-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] label-md font-semibold border-b border-[var(--color-border-secondary)]">
                <th className="p-4">Project</th>
                <th className="p-4">Funding</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-tertiary)] bg-white">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--color-text-primary)] max-w-xs truncate">
                          {project.title}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                           ID: #{project.id} • {project.category_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-bold text-emerald-600">LE {parseFloat(project.total_donated || '0').toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Target: LE {parseFloat(project.total_target).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      project.is_cancelled ? 'bg-red-50 text-red-700' :
                      project.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {project.is_cancelled ? 'Cancelled' : project.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/projects/${project.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      {!project.is_cancelled && (
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleCancelProject(project.id)}
                          title="Cancel Project"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
