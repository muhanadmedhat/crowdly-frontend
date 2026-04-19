interface UserAvatarProps {
  username?: string;
  size?: string;
  className?: string;
}

const UserAvatar = ({ username, size = 'w-9 h-9', className = '' }: UserAvatarProps) => {
  const initials = (username || '??').slice(0, 2).toUpperCase();
  return (
    <div 
      className={`${size} rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm ${className}`}
      title={username}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
