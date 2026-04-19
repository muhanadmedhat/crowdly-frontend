import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  FileWarning,
  MessageSquareWarning,
  ReplyAll,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { removeToken } from '../../store/slices/authSlicer';

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeToken());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Categories', path: '/admin/categories', icon: <FolderTree size={20} />, exact: false },
    { name: 'Projects', path: '/admin/projects', icon: <FolderTree size={20} />, exact: false },
    { name: 'Users', path: '/admin/users', icon: <FolderTree size={20} />, exact: false },
    { name: 'Donations', path: '/admin/donations', icon: <FolderTree size={20} />, exact: false },
    {
      name: 'Project Reports',
      path: '/admin/reports/projects',
      icon: <FileWarning size={20} />,
      exact: false,
    },
    {
      name: 'Comment Reports',
      path: '/admin/reports/comments',
      icon: <MessageSquareWarning size={20} />,
      exact: false,
    },
    {
      name: 'Reply Reports',
      path: '/admin/reports/replies',
      icon: <ReplyAll size={20} />,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 bg-white min-h-screen flex flex-col border-r border-[#eee]">
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">
          Crowdly Admin
        </h2>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-[#ff5021] text-white shadow-md'
                  : 'text-[#666] hover:bg-[#faf9f6] hover:text-[#111]'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#eee]">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-md transition-colors hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
