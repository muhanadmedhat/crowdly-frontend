import { useState, useEffect } from 'react';
import { getProjects, getCategories } from '../services/projects';
import { getProjectImage, optimizeImage } from '../utils/image';

import api from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import withLoading from '../utils/WithLoading';
import './ExplorePage.css';

interface ActiveFilter {
  label: string;
  onRemove: () => void;
}

interface Category {
  id: number;
  name: string;
  project_count?: number;
}

interface Project {
  id: number;
  title: string;
  details: string;
  category?: Category;
  total_target: number | string;
  total_donated: number | string;
  end_time: string;
  average_rating?: number;
  donor_count?: number;
  owner?: string;
  images?: { image: string }[];
  image?: string;
  cover_image?: string;
}

// ── RatingPicker sub-component ─────────────────────────────────────────────
function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const effective = hovered || value; // stars to light up

  return (
    <div className="rating-picker">
      <div
        className="rating-stars-row"
        onMouseLeave={() => setHovered(0)}
        role="group"
        aria-label="Minimum rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= effective ? 'star-btn--filled' : ''} ${
              star <= value && !hovered ? 'star-btn--selected' : ''
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''} & up`}
            aria-pressed={value === star}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(value === star ? 0 : star)}
          >
            ★
          </button>
        ))}
      </div>

      {/* Contextual label */}
      <p className="rating-picker-hint">
        {value === 0
          ? 'All ratings'
          : value === 5
          ? 'Only 5-star projects'
          : `${value}★ and above`}
      </p>

      {/* "Any" reset chip — only visible when a rating is active */}
      {value > 0 && (
        <button
          type="button"
          className="rating-all-chip"
          onClick={() => onChange(0)}
        >
          ✕ Clear rating
        </button>
      )}
    </div>
  );
}

export default function ExplorePage() {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [status, setStatus] = useState('');
  const [maxGoal, setMaxGoal] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Fetch categories once ──────────────────────────────────────────────────
  useEffect(() => {
    withLoading(getCategories())
      .then((res: any) => setCategories(res.data?.results ?? res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  // ── Helper: build current filter params ────────────────────────────────────
  const buildFilterParams = () => ({
    ...(debouncedSearch             ? { search: debouncedSearch }                  : {}),
    ...(selectedCategories[0]       ? { category: selectedCategories[0] }          : {}),
    ...(status                      ? { status }                                   : {}),
    ...(maxGoal < 100000            ? { max_goal: maxGoal }                        : {}),
    ...(minRating > 0               ? { min_rating: minRating }                    : {}),
  });

  // ── Effect 1: Filter changes → reset cursor, replace results ──────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNextCursor(null);

    withLoading(getProjects(buildFilterParams()))
      .then((res: any) => {
        if (cancelled) return;
        const data = res.data;
        setProjects(data.results ?? []);
        setTotalCount(data.count ?? 0);
        setNextCursor(data.next ?? null);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategories, status, maxGoal, minRating]);

  // ── Load more: follows the cursor `next` URL returned by the API ───────────
  // Fetching the full `next` URL directly honours the cursor paginator;
  // Axios forwards the auth interceptors even for absolute URLs.
  const loadMore = async () => {
    if (isLoadingMore || !nextCursor) return;
    setIsLoadingMore(true);
    try {
      const res = await withLoading(api.get(nextCursor));
      const data = res.data;
      setProjects((prev) => [...prev, ...(data.results ?? [])]);
      setTotalCount(data.count ?? 0);
      setNextCursor(data.next ?? null);
    } catch {
      // silently ignore — existing results stay on screen
    } finally {
      setIsLoadingMore(false);
    }
  };


  // ── Clear filters ──────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategories([]);
    setStatus('');
    setMaxGoal(100000);
    setMinRating(0);
  };

  // ── Toggle category ────────────────────────────────────────────────────────
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [id]));
  };

  // ── Active filter pills ────────────────────────────────────────────────────
  const activeFilters: ActiveFilter[] = [];

  selectedCategories.forEach((catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      activeFilters.push({
        label: cat.name.toUpperCase(),
        onRemove: () => setSelectedCategories((prev) => prev.filter((id) => id !== catId)),
      });
    }
  });

  if (status) {
    activeFilters.push({
      label: status.toUpperCase(),
      onRemove: () => setStatus(''),
    });
  }

  if (minRating > 0) {
    activeFilters.push({
      label: `${minRating}★ & ABOVE`,
      onRemove: () => setMinRating(0),
    });
  }

  if (maxGoal < 100000) {
    activeFilters.push({
      label: `GOAL ≤ $${(maxGoal / 1000).toFixed(0)}K`,
      onRemove: () => setMaxGoal(100000),
    });
  }



  const shown = projects.length;
  const remaining = Math.max(0, totalCount - shown);

  return (
    <div className="explore-page">
      {/* ── Sidebar ── */}
      <aside className="explore-sidebar">
        <div className="sidebar-card">
          {/* Header */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">Filters</h2>
            <p className="sidebar-subtitle">REFINE YOUR DISCOVERY</p>
          </div>

          {/* Keyword Search */}
          <div className="filter-section">
            <input
              id="explore-search"
              type="text"
              className="filter-search-input"
              placeholder="Keyword search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="filter-section">
            <p className="filter-label">CATEGORY</p>
            <ul className="category-list">
              {categories.map((cat: Category) => (
                <li key={cat.id} className="category-item">
                  <label className="category-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    <span className="category-name">{cat.name}</span>
                  </label>
                  <span className="category-count">{cat.project_count ?? ''}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div className="filter-section">
            <p className="filter-label">STATUS</p>
            <div className="select-wrapper">
              <select
                id="explore-status"
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="select-arrow">▾</span>
            </div>
          </div>

          {/* Goal Range */}
          <div className="filter-section">
            <div className="filter-label-row">
              <p className="filter-label">GOAL RANGE</p>
              <span className="filter-range-value">
                ${'0'} – ${maxGoal >= 100000 ? '100K' : `${(maxGoal / 1000).toFixed(0)}K`}
              </span>
            </div>
            <input
              id="explore-goal-range"
              type="range"
              className="filter-range"
              min={0}
              max={100000}
              step={5000}
              value={maxGoal}
              onChange={(e) => setMaxGoal(Number(e.target.value))}
              style={{ '--value': maxGoal } as React.CSSProperties}
            />
          </div>

          {/* Rating */}
          <div className="filter-section">
            <p className="filter-label">MIN RATING</p>
            <RatingPicker value={minRating} onChange={setMinRating} />
          </div>

          {/* Clear All */}
          <button className="clear-filters-btn" onClick={clearFilters}>
            CLEAR ALL FILTERS
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="explore-main">
        {/* Title & subtitle */}
        <h1 className="explore-title">Explore Projects</h1>
        <p className="explore-subtitle">
          Showing {shown} campaign{totalCount !== 1 ? 's' : ''} matching your curation
        </p>

        {/* Sort + pills row */}
        <div className="explore-toolbar">
          {/* Active pills */}
          {activeFilters.length > 0 && (
            <div className="active-pills">
              {activeFilters.map((f) => (
                <span key={f.label} className="filter-pill">
                  {f.label}
                  <button
                    className="pill-remove"
                    onClick={f.onRemove}
                    aria-label={`Remove filter ${f.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Project grid */}
        <div className="project-grid">
          {isLoading ? (
            <LoadingSkeleton count={12} />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects found"
              message="Try adjusting your filters or search term."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            projects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                details={project.details}
                category={project.category?.name ?? ''}
                total_target={Number(project.total_target)}
                total_donated={Number(project.total_donated)}
                end_time={project.end_time}
                rating={project.average_rating ?? 0}
                donor_count={project.donor_count ?? 0}
                creator_name={project.owner ?? ''}
                image={optimizeImage(getProjectImage(project), 600)}
              />
            ))
          )}
        </div>

        {/* Load more */}
        {!isLoading && nextCursor && shown < totalCount && (
          <div className="load-more-section">
            <button
              id="explore-load-more"
              className="load-more-btn"
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore
                ? 'Loading…'
                : `Load ${Math.min(12, remaining)} more · ${remaining} remaining`}
            </button>
            <p className="load-more-meta">
              SHOWING {shown} OF {totalCount} TOTAL PROJECTS
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
