"use client";

import { useEffect, useState } from "react";

/**
 * Scrollspy: devuelve el `id` de la sección que ocupa la franja superior-media
 * del viewport (o `null` si ninguna). Si varias coinciden, gana la primera en
 * el orden de `ids`.
 */
export const useActiveSection = (ids: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key ? key.split("|") : [];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActiveId(sectionIds.find((id) => visible.has(id)) ?? null);
      },
      // Franja entre el 35 % y el 45 % de la altura: deja margen a la navbar.
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
};
