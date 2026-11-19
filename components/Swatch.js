export default function Swatch({ icon, tint, big = false }) {
  return (
    <div className={big ? 'swatch big' : 'swatch'} style={{ background: tint }} aria-hidden="true">
      <span className="icon">{icon}</span>
    </div>
  );
}
