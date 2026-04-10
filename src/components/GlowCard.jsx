import { useRef, useState } from 'react';
import './GlowCard.css';

export function GlowCard({ children, className = '', color = '201,161,74' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      <div
        className="glow-card-spotlight"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(${color},0.12), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
