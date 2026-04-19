import { useEffect, useState } from "react";
import type { Project } from "../../types/project";

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

type SearchFilters = {
  query: string;
  status?: string;
  featured?: string;
};

export const useSearchProject = ({
  query,
  status,
  featured,
}: SearchFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (query.trim()) params.append("search", query);
        if (status && status !== "all") params.append("status", status);
        if (featured && featured !== "all") params.append("featured", featured);

        const res = await fetch(`${BASE_URL}/projects/?${params.toString()}`);
        const data = await res.json();

        if (data.results) {
          setProjects(data.results);
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [query, status, featured]);

  return { projects, loading };
};