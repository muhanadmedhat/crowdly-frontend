import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../services/projects';
import { getProjectImage, optimizeImage } from '../utils/image';


interface HeroProject {
  id: number;
  title: string;
  total_donated?: number | string;
  total_target?: number | string;
  donor_count?: number;
  average_rating?: number;
  category?: { name: string };
  images?: { image: string; image_url?: string }[];
  image?: string;
  cover_image?: string;
}

const ACCENT = ['#ff5600', '#ff7a2f', '#ffa366'];

export default function Hero() {
  const [projects, setProjects] = useState<HeroProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProjects()
      .then((res) => {
        const data = res.data;
        const list: HeroProject[] = Array.isArray(data) ? data : (data.results ?? []);
        setProjects(list.slice(0, 3));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const pct = (p: HeroProject) => {
    const target = Number(p.total_target) || 1;
    const donated = Number(p.total_donated) || 0;
    return Math.min(100, Math.round((donated / target) * 100));
  };

  return (
    <div className="hero-section">
      <div className="hero-inner">

        {/* ── Left copy ── */}
        <div className="hero-copy">
          <p className="label-md text-primary tracking-wider uppercase animate-fade-in-up delay-100">
            Become the positivity you hope
          </p>
          <h1 className="hero-heading animate-fade-in-up delay-200">
            Back the Ideas That <br /> Deserve to Exist
          </h1>
          <p className="hero-sub animate-fade-in-up delay-300">
            Discover campaigns from creators, change makers, and communities
            around the world. We create the bold, unique, and the essential.
          </p>

          <div className="hero-actions animate-fade-in-up delay-400">
            <Link to="/explore">
              <button type="button" className="btn-primary hero-btn-primary">
                Explore Projects
              </button>
            </Link>
            <Link to="/register">
              <button type="button" className="btn-secondary hero-btn-secondary">
                Start A Campaign
              </button>
            </Link>
          </div>
        </div>

        {/* ── Right mosaic ── */}
        <div className="hero-mosaic animate-fade-in delay-300">
          {loading ? (
            <>
              <div className="mosaic-card mosaic-card--tall mosaic-skeleton" />
              <div className="mosaic-card mosaic-skeleton" />
              <div className="mosaic-card mosaic-skeleton" />
            </>
          ) : projects.length === 0 ? (
            <div className="mosaic-empty">
              <span>✦</span>
              <p>Featured projects loading soon</p>
            </div>
          ) : (
            projects.map((p, i) => {
              const rawImg = getProjectImage(p);
              const img = i === 0 ? optimizeImage(rawImg, 1000) : optimizeImage(rawImg, 600);

              const progress = pct(p);
              const raised = Number(p.total_donated || 0);
              const donors = p.donor_count ?? 0;
              const rating = p.average_rating ?? 0;

              return (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className={`mosaic-card ${i === 0 ? 'mosaic-card--tall' : ''}`}
                  style={
                    !img
                      ? {
                          background: `linear-gradient(135deg, ${ACCENT[i % ACCENT.length]}22, ${ACCENT[(i + 1) % ACCENT.length]}44)`,
                        }
                      : {}
                  }
                >
                  {img && <img src={img} alt={p.title} className="mosaic-img" />}

                  <div className="mosaic-overlay">
                    {p.category?.name && (
                      <span className="mosaic-cat">{p.category.name}</span>
                    )}
                    <p className="mosaic-title">{p.title}</p>

                    {/* Progress bar */}
                    <div className="mosaic-progress-track">
                      <div
                        className="mosaic-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Stats row */}
                    <div className="mosaic-stats">
                      <span className="mosaic-stat">
                        <span className="mosaic-stat-value">{progress}%</span>
                        <span className="mosaic-stat-label">funded</span>
                      </span>
                      {raised > 0 && (
                        <span className="mosaic-stat">
                          <span className="mosaic-stat-value">
                            ${raised >= 1000 ? `${(raised / 1000).toFixed(1)}k` : raised}
                          </span>
                          <span className="mosaic-stat-label">raised</span>
                        </span>
                      )}
                      {donors > 0 && (
                        <span className="mosaic-stat">
                          <span className="mosaic-stat-value">{donors}</span>
                          <span className="mosaic-stat-label">backers</span>
                        </span>
                      )}
                      {rating > 0 && (
                        <span className="mosaic-stat">
                          <span className="mosaic-stat-value">★ {rating.toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}