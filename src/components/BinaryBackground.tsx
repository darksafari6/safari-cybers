import React, { useEffect, useState } from 'react';

export default function BinaryBackground() {
  const [columns, setColumns] = useState<{ id: number; left: string; duration: string; delay: string; content: string }[]>([]);

  useEffect(() => {
    const columnCount = Math.floor(window.innerWidth / 25);
    const newColumns = Array.from({ length: columnCount }).map((_, i) => ({
      id: i,
      left: `${(i / columnCount) * 100}%`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 5}s`,
      content: Array.from({ length: 50 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')
    }));
    setColumns(newColumns);
  }, []);

  return (
    <div className="binary-bg">
      {columns.map((col) => (
        <div
          key={col.id}
          className="binary-column"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {col.content}
        </div>
      ))}
    </div>
  );
}
