interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string; // optional button label
  onAction?: () => void; // optional button handler
}

export default function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {/* Icon */}
      <div className="empty-state-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="23" stroke="var(--color-border-secondary)" strokeWidth="1" />
          <path
            d="M16 24h16M24 16v16"
            stroke="var(--color-border-secondary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform="rotate(45 24 24)"
          />
        </svg>
      </div>

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>

      {actionLabel && onAction && (
        <button className="empty-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
