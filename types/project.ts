export interface Project {
  id: number;
  title: string;
  details: string;
  status: string;
  total_target: number;
  total_donated?: number;
  is_featured?: boolean;
}