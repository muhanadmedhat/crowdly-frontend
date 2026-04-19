interface StarRatingProps {
  rating: number; // e.g. 4.3, 3.7, 5.0
  maxStars?: number; // default 5
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, maxStars = 5, size = 'sm' }: StarRatingProps) {
  const fontSize = size === 'lg' ? '22px' : size === 'md' ? '18px' : '14px';

  const getStarType = (index: number): 'full' | 'half' | 'empty' => {
    const diff = rating - index;
    if (diff >= 1) return 'full';
    if (diff >= 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className="star-rating" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const type = getStarType(i);
        return (
          <span
            key={i}
            style={{
              fontSize,
              color: type === 'empty' ? 'var(--color-border-secondary)' : '#D85A30',
              lineHeight: 1,
            }}
          >
            {type === 'full' && '★'}
            {type === 'half' && '⯨'}
            {type === 'empty' && '☆'}
          </span>
        );
      })}
      <span
        style={{
          fontSize: size === 'lg' ? '15px' : '12px',
          color: 'var(--color-text-secondary)',
          marginLeft: '4px',
        }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
