import { useSearchParams } from 'react-router-dom';
import { useSearchProject } from '../hooks/useSearchProject';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'all';
  const featured = searchParams.get('featured') || 'all';

  const { projects, loading } = useSearchProject({
    query,
    status,
    featured,
  });

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', value);
    setSearchParams(params);
  };

  const handleFeaturedChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('featured', value);
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f3ed] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-3 h-10 w-64 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-52 animate-pulse rounded bg-neutral-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="h-64 animate-pulse bg-neutral-200" />
                <div className="p-5">
                  <div className="mb-3 h-6 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-neutral-200" />
                  <div className="mb-2 h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ed] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Search
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
            Search Results
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:text-base">
            {query ? `Results for "${query}"` : 'Browse matching projects'}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Search term</label>
            <input
              type="text"
              value={query}
              readOnly
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Featured</label>
            <select
              value={featured}
              onChange={(e) => handleFeaturedChange(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All</option>
              <option value="true">Featured only</option>
              <option value="false">Non-featured</option>
            </select>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-black">No results found</h2>
            <p className="mx-auto max-w-md text-gray-600">
              Try another keyword or adjust your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-2xl bg-white px-5 py-3 text-sm text-gray-600 shadow-sm inline-block">
              <span className="font-semibold text-black">{projects.length}</span> result
              {projects.length !== 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((project) => {
                const target = Number(project.total_target) || 0;
                const donated = Number(project.total_donated) || 0;
                const progress = target > 0 ? Math.min((donated / target) * 100, 100) : 0;

                return (
                  <div
                    key={project.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-orange-100 via-orange-50 to-neutral-200">
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            project.status?.toLowerCase() === 'running'
                              ? 'bg-green-100 text-green-700'
                              : project.status?.toLowerCase() === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {project.status}
                        </span>

                        {project.is_featured && (
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="mb-2 line-clamp-2 text-xl font-bold text-black">
                        {project.title}
                      </h2>

                      <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {project.details}
                      </p>

                      <div className="mb-4 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Target</span>
                        <span className="font-semibold text-black">{target.toFixed(2)}</span>
                      </div>

                      <div className="mb-4 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Raised</span>
                        <span className="font-semibold text-black">{donated.toFixed(2)}</span>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>

                      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <button className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
                        View Project
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
