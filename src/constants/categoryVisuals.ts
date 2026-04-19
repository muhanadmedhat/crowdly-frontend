type CategoryVisual = {
  gradient: string;
  count: string;
  image?: string;
};

export const categoryVisuals: Record<string, CategoryVisual> = {
  technology: {
    gradient: "from-blue-900/70 to-blue-500/40",
    count: "1,240 PROJECTS",
  },
  "art & creative": {
    gradient: "from-fuchsia-700/70 to-purple-500/40",
    count: "850 PROJECTS",
  },
  environment: {
    gradient: "from-green-900/70 to-green-500/40",
    count: "2,100 PROJECTS",
  },
  health: {
    gradient: "from-red-700/70 to-rose-400/40",
    count: "940 PROJECTS",
  },
  education: {
    gradient: "from-yellow-700/70 to-amber-300/40",
    count: "1,580 PROJECTS",
  },
  community: {
    gradient: "from-cyan-700/70 to-teal-400/40",
    count: "3,200 PROJECTS",
  },
  food: {
    gradient: "from-orange-700/70 to-amber-400/40",
    count: "620 PROJECTS",
  },
  sports: {
    gradient: "from-blue-700/70 to-sky-400/40",
    count: "480 PROJECTS",
  },
  music: {
    gradient: "from-pink-700/70 to-rose-400/40",
    count: "1,100 PROJECTS",
  },
  film: {
    gradient: "from-slate-900/80 to-slate-600/50",
    count: "740 PROJECTS",
  },
};

export const getCategoryVisual = (name: string) => {
  return (
    categoryVisuals[name.trim().toLowerCase()] || {
      gradient: "from-neutral-800/70 to-neutral-500/40",
      count: "PROJECTS",
    }
  );
};