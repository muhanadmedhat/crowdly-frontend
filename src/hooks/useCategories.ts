import { useEffect, useState } from "react";

export type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
  projects_count?: number;
};

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/projects/categories/`);
        const data = await res.json();

        console.log("categories response:", data);
        setCategories(data);
      } catch (err) {
        console.error("categories error:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loadingCategories };
};