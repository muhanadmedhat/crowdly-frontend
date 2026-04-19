import { useEffect, useState } from "react";
import type { Project } from "../../types/project";

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const useProjectsByCategory = (categoryId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/projects/categories/${categoryId}/projects/`
        );

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

    if (categoryId) {
      fetchProjects();
    }
  }, [categoryId]);

  return { projects, loading };
};