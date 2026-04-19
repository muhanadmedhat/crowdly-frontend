import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import StarRating from './StarRating';
import './ProjectCard.css';

interface ProjectCardProps {
  id: number;
  title: string;
  details: string;
  category: string;
  total_target: number;
  total_donated: number;
  end_time: string;
  rating: number;
  donor_count: number;
  creator_name: string;
  image?: string;
}

export default function ProjectCard({
  id,
  title,
  details,
  category,
  total_target,
  total_donated,
  end_time,
  rating,
  donor_count,
  creator_name,
  image,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const daysLeft = useMemo(
    () =>
      Math.max(
        0,
        // eslint-disable-next-line react-hooks/purity
        Math.ceil((new Date(end_time).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      ),
    [end_time]
  );

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${id}`)}>
      {/* Image */}
      <div className="card-image">
        {image ? <img src={image} alt={title} /> : <div className="card-image-placeholder" />}
        <span className="category-badge">{category}</span>
        <span className="days-left-badge">⏱ {daysLeft} DAYS LEFT</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-top">
          <h3 className="card-title">{title}</h3>
          <StarRating rating={rating} size="sm" />
        </div>

        <p className="card-desc">{details}</p>

        <div className="card-author">
          <div className="author-avatar">{creator_name.slice(0, 2).toUpperCase()}</div>
          <span>BY {creator_name.toUpperCase()}</span>
        </div>

        {/* Progress */}
        <ProgressBar
          total_target={total_target}
          total_donated={total_donated}
          donor_count={donor_count}
          size="sm"
        />

        <button
          className="donate-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${id}`);
          }}
        >
          DONATE NOW
        </button>
      </div>
    </div>
  );
}
