import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SquareArrowUpRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { getTopRatedProjects } from '../services/projects';
import ProjectCard from './ProjectCard';
interface Project {
  id: number;
  title: string;
  details: string;
  category?: { name: string };
  total_target: number | string;
  total_donated: number | string;
  end_time: string;
  average_rating?: number;
  donor_count?: number;
  creator?: string;
  images?: { image: string; image_url?: string }[];
}

export default function Favorites() {
  const ref = useReveal<HTMLDivElement>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopRatedProjects()
      .then((res: any) => {
        const data = res.data;
        const list: Project[] = Array.isArray(data) ? data : (data.results ?? []);
        setProjects(list.slice(0, 3));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-section" ref={ref}>
      <div className="home-section-inner">
        {/* Header row */}
        <div className="section-header-row">
          <div>
            <p className="reveal label-md text-primary tracking-wider uppercase">Crowd Favorites</p>
            <h2 className="reveal headline-md mt-2 delay-100">Campaigns People Love</h2>
          </div>
          <Link to="/explore/?sort=-average_rating" className="reveal section-view-all delay-200">
            <span>View All</span>
            <SquareArrowUpRight size={16} className="section-view-all-icon" />
          </Link>
        </div>

        {/* Cards */}
        <div className="home-cards-grid">
          {loading ? (
            <HomeCardSkeleton count={3} />
          ) : projects.length === 0 ? (
            <p className="home-empty">No top-rated projects yet.</p>
          ) : (
            projects.map((p, i) => (
              <div key={p.id} className={`reveal delay-${(i + 1) * 100}`}>
                <ProjectCard
                  id={p.id}
                  title={p.title}
                  details={p.details}
                  category={p.category?.name ?? ''}
                  total_target={Number(p.total_target)}
                  total_donated={Number(p.total_donated)}
                  end_time={p.end_time}
                  rating={p.average_rating ?? 0}
                  donor_count={p.donor_count ?? 0}
                  creator_name={p.creator ?? ''}
                  image={p.images?.[0]?.image_url || p.images?.[0]?.image}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable skeleton exported for use in other sections */
export function HomeCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="home-skeleton-card">
          <div className="home-skeleton-img skeleton-pulse" />
          <div className="home-skeleton-body">
            <div className="home-skeleton-line skeleton-pulse" style={{ width: '60%' }} />
            <div
              className="home-skeleton-line skeleton-pulse"
              style={{ width: '90%', marginTop: 8 }}
            />
            <div
              className="home-skeleton-line skeleton-pulse"
              style={{ width: '75%', marginTop: 6 }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
