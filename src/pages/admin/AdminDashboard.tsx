import { FolderTree, FileWarning, MessageSquareWarning, ReplyAll } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <FolderTree size={24} className="text-blue-500" />,
    },
    {
      name: 'Projects',
      path: '/admin/projects',
      icon: <FolderTree size={24} className="text-emerald-500" />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <FolderTree size={24} className="text-indigo-500" />,
    },
    {
      name: 'Donations',
      path: '/admin/donations',
      icon: <FolderTree size={24} className="text-amber-500" />,
    },
    {
      name: 'Project Reports',
      path: '/admin/reports/projects',
      icon: <FileWarning size={24} className="text-orange-500" />,
    },
    {
      name: 'Comment Reports',
      path: '/admin/reports/comments',
      icon: <MessageSquareWarning size={24} className="text-purple-500" />,
    },
    {
      name: 'Reply Reports',
      path: '/admin/reports/replies',
      icon: <ReplyAll size={24} className="text-red-500" />,
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#111]">Dashboard</h1>
        <p className="font-[var(--font-serif)] italic text-[#666] mt-2 text-lg">
          Welcome back. Select a module to manage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.path}
            className="bg-white p-6 flex flex-col items-center justify-center gap-4 rounded-xl hover:shadow-xl transition-all duration-300 border border-[#eee] hover:border-[#ff5021] group"
          >
            <div className="p-4 bg-[#faf9f6] rounded-full group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <h3 className="font-semibold text-lg text-[#333]">{stat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
