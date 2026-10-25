"use client";

import { useEffect, useState } from "react";

export default function FloatingHearts({ count = 12 }: { count?: number }) {
  const [hearts, setHearts] = useState<
    { id: number; left: number; delay: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      size: 0.8 + Math.random() * 1.2,
    }));
    setHearts(items);
  }, [count]);

  return (
    <div className="hearts-bg" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-particle"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}rem`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
