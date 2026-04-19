interface ProgressBarProps {
  total_target: number;
  total_donated: number;
  showMeta?: boolean; // show "X% FUNDED · Y DONORS" text below the bar
  donor_count?: number;
  size?: 'sm' | 'md'; // sm = inside card, md = inside project detail
}

export default function ProgressBar({
  total_target,
  total_donated,
  showMeta = true,
  donor_count = 0,
  size = 'sm',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((total_donated / total_target) * 100), 100);

  const barHeight = size === 'md' ? '8px' : '4px';

  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-bg" style={{ height: barHeight }}>
        <div className="progress-bar-fill" style={{ width: `${percentage}%`, height: barHeight }} />
      </div>

      {showMeta && (
        <div className="progress-meta">
          <strong>{percentage}% FUNDED</strong>
          {donor_count > 0 && <span>{donor_count.toLocaleString()} DONORS</span>}
        </div>
      )}
    </div>
  );
}
