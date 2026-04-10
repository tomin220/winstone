import './ShimmerText.css';

export function ShimmerText({ children, className = '' }) {
  return (
    <span className={`shimmer-text ${className}`}>
      {children}
    </span>
  );
}
