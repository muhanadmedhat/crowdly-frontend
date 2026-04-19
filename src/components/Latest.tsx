import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SquareArrowUpRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { getLatestProjects } from '../services/projects';
import ProjectCard from './ProjectCard';
import { HomeCardSkeleton } from './Favorites';
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

export default function Latest() {
  const ref = useReveal<HTMLDivElement>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestProjects()
      .then((res: any) => {
        const data = res.data;
        const list: Project[] = Array.isArray(data) ? data : (data.results ?? []);
        setProjects(list.slice(0, 3));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-section home-section--alt" ref={ref}>
      <div className="home-section-inner">

        {/* Header */}
        <div className="section-header-row">
          <div>
            <h2 className="reveal headline-md">Just Launched</h2>
            <p className="reveal body-md text-text-secondary mt-1 delay-100">
              The freshest projects we can offer — help new ideas take off!
            </p>
          </div>
          <Link to="/explore" className="reveal section-view-all delay-200">
            <span>See All</span>
            <SquareArrowUpRight size={16} className="section-view-all-icon" />
          </Link>
        </div>

        {/* Cards */}
        <div className="home-cards-grid">
          {loading ? (
            <HomeCardSkeleton count={3} />
          ) : projects.length === 0 ? (
            <p className="home-empty">No new projects yet.</p>
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