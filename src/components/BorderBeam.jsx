import './BorderBeam.css';

export function BorderBeam({ size = 200, duration = 8, colorFrom = '#C9A14A', colorTo = '#FFE08A' }) {
  return (
    <div
      className="border-beam"
      style={{
        '--beam-size': `${size}px`,
        '--beam-duration': `${duration}s`,
        '--beam-from': colorFrom,
        '--beam-to': colorTo,
      }}
    />
  );
}
