import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useProjectsByCategory } from "../hooks/useProjects";

const CategoryProjects = () => {
  const { id } = useParams();

  const { projects, loading } = useProjectsByCategory(id as string);
  const { categories } = useCategories();

  const selectedCategory = categories.find(
    (cat) => cat.id === Number(id)
  );

  const categoryName = selectedCategory
    ? selectedCategory.name
    : "Category";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/*Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Explore by Category
            </p>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Explore {categoryName} Projects
            </h1>

            <p className="mt-3 text-gray-600 max-w-xl">
              Browse projects in this category and discover ideas worth backing.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 text-sm text-gray-600 shadow-sm">
            <span className="font-semibold text-black">
              {projects.length}
            </span>{" "}
            project{projects.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/*No Projects */}
        {projects.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="mb-3 text-2xl font-bold">No projects found</h2>
            <p className="text-gray-600">
              There are no projects in this category right now. Try another
              category or come back later.
            </p>
          </div>
        ) : (
          /*Grid */
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {projects.map((project) => {
                const totalTarget = Number(project.total_target || 0);
                const totalDonated = Number(project.total_donated || 0);

                const progress = totalTarget
                  ? Math.min((totalDonated / totalTarget) * 100, 100)
                  : 0;

                return (
                  <div
                    key={project.id}
                    className="w-[340px] overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/*Image */}
                    <div className="relative h-56 bg-gradient-to-br from-orange-100 via-orange-50 to-white">

                      {/* Status */}
                      <span
                        className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium ${
                          project.status?.toLowerCase() === "running"
                            ? "bg-green-100 text-green-700"
                            : project.status?.toLowerCase() === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {project.status}
                      </span>

                      {/* Featured */}
                      {project.is_featured && (
                        <span className="absolute top-3 right-3 rounded-full bg-black text-white px-3 py-1 text-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    {/*Content */}
                    <div className="p-5">

                      <h3 className="text-lg font-bold mb-2 line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                        {project.details || "No details available"}
                      </p>

                      {/* Stats */}
                      <div className="space-y-2 text-sm text-gray-600">

                        <div className="flex justify-between">
                          <span>Target</span>
                          <span className="font-medium text-black">
                            {totalTarget.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Raised</span>
                          <span className="font-medium text-black">
                            {totalDonated.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Progress</span>
                          <span className="font-medium text-black">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="mt-5 block w-full rounded-full bg-black py-2 text-center text-sm font-medium text-white hover:bg-gray-800 transition"
                    >
                      View Project
                    </Link>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryProjects;