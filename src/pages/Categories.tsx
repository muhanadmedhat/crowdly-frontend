import { Link } from "react-router-dom";
import { useCategories, type Category } from "../hooks/useCategories";
import { getCategoryVisual } from "../constants/categoryVisuals";

export default function Categories() {
  const { categories, loadingCategories } = useCategories();

  if (loadingCategories) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="mb-3 h-4 w-40 animate-pulse rounded bg-neutral-300" />
            <div className="mb-3 h-12 w-80 animate-pulse rounded bg-neutral-300" />
            <div className="h-5 w-72 animate-pulse rounded bg-neutral-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[300px] animate-pulse rounded-md bg-neutral-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-[52px] font-bold leading-none tracking-tight text-black">
            Browse Categories
          </h1>

          <p className="mt-3 text-[17px] text-gray-500">
            Find a cause that speaks to you
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category: Category) => {
            const visual = getCategoryVisual(category.name || "");
            const countText =
              typeof category.projects_count === "number"
                ? `${category.projects_count} PROJECTS`
                : visual.count;

            return (
              <Link
                key={category.id}
                to={`/categories/${category.id}/projects`}
                className="group block"
              >
                <div className="relative h-[300px] overflow-hidden rounded-md bg-neutral-300 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-300" />
                  )}

                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${visual.gradient}`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h2 className="text-[22px] font-bold leading-tight transition duration-300 group-hover:translate-y-[-2px]">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-[11px] uppercase tracking-wide text-white/85">
                      {countText}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
