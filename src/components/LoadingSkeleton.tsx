interface LoadingSkeletonProps {
  count?: number; // how many skeleton cards to show, default 6
}

export default function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          {/* Image placeholder */}
          <div className="skeleton-image skeleton-pulse" />

          {/* Body */}
          <div className="skeleton-body">
            {/* Title line */}
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '75%', height: '16px' }}
            />
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '50%', height: '16px', marginTop: '8px' }}
            />

            {/* Description lines */}
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '100%', height: '12px', marginTop: '16px' }}
            />
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '85%', height: '12px', marginTop: '6px' }}
            />

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <div className="skeleton-avatar skeleton-pulse" />
              <div
                className="skeleton-line skeleton-pulse"
                style={{ width: '100px', height: '12px' }}
              />
            </div>

            {/* Progress bar */}
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '100%', height: '4px', marginTop: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <div
                className="skeleton-line skeleton-pulse"
                style={{ width: '80px', height: '11px' }}
              />
              <div
                className="skeleton-line skeleton-pulse"
                style={{ width: '60px', height: '11px' }}
              />
            </div>

            {/* Button */}
            <div
              className="skeleton-line skeleton-pulse"
              style={{ width: '100%', height: '38px', marginTop: '12px', borderRadius: '8px' }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
