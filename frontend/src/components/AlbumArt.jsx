export default function AlbumArt({ album, size, showYear = false }) {
  const initials = album.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const litHue = album.hue.replace(/(\d+)%$/, (_, n) => (parseInt(n) + 16) + '%')

  return (
    <div style={{
      width: size, height: size, position: 'relative', overflow: 'hidden', flexShrink: 0,
      background: `linear-gradient(135deg, hsl(${litHue}), hsl(${album.hue}))`,
    }}>
      {[0.84, 0.67, 0.51].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', width: size * r, height: size * r, borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.09)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.13), transparent 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size * 0.04 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: size * 0.22, fontWeight: 700, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', textShadow: '0 2px 8px rgba(0,0,0,0.65)', letterSpacing: -1 }}>
          {initials}
        </span>
        {showYear && (
          <span style={{ fontFamily: 'Helvetica Neue, sans-serif', fontSize: size * 0.085, fontWeight: 300, color: 'rgba(255,255,255,0.4)', letterSpacing: size * 0.02, textTransform: 'uppercase' }}>
            {album.year}
          </span>
        )}
      </div>
    </div>
  )
}
