import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SquareArrowUpRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { getFeaturedProjects } from '../services/projects';
import { getProjectImage, optimizeImage } from '../utils/image';

import { BarLoader } from 'react-spinners';
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
  image?: string;
  cover_image?: string;
}

export default function Featured() {
  const ref = useReveal<HTMLDivElement>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProjects()
      .then((res) => {
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
        {/* Centred header */}
        <div className="section-header-centered">
          <p className="reveal label-md text-primary uppercase italic tracking-widest">
            The Editor's choice
          </p>
          <h2 className="reveal headline-md mt-3 delay-100">Hand-Picked by Our Team</h2>
          <p className="reveal body-md text-center max-w-md mx-auto text-text-secondary py-2 delay-200">
            Every week our editorial admins select projects that demonstrate a story worth telling —
            a gesture towards humanity and a brighter future.
          </p>
          <Link
            to="/explore/?sort=-total_donated"
            className="reveal section-view-all mx-auto delay-300"
          >
            <span>Browse All Featured</span>
            <SquareArrowUpRight size={16} className="section-view-all-icon" />
          </Link>
        </div>

        {/* Cards */}
        <div className="home-cards-grid mt-10">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
              <BarLoader color="var(--color-primary)" width={200} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
                <HomeCardSkeleton count={3} />
              </div>
            </div>
          ) : projects.length === 0 ? (
            <p className="home-empty">No featured projects yet.</p>
          ) : (
            projects.map((p, i) => (
              <div key={p.id} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
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
                  image={optimizeImage(getProjectImage(p), 600)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
