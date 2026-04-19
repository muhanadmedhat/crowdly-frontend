import { useEffect, useRef } from 'react';

/**
 * Attach this hook to a container ref.
 * Every child element with a `.reveal*` class inside that container
 * will have `.visible` added once it enters the viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );

    // Observe the container itself if it carries a reveal class
    if (
      container.classList.contains('reveal') ||
      container.classList.contains('reveal-scale') ||
      container.classList.contains('reveal-left') ||
      container.classList.contains('reveal-right') ||
      container.classList.contains('reveal-expand')
    ) {
      observer.observe(container);
    }

    const items = container.querySelectorAll(
      '.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-expand',
    );
    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
