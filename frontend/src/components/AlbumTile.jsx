import AlbumArt from './AlbumArt.jsx'

const TILE_SIZE = 86

export default function AlbumTile({ album, highlighted, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        width: TILE_SIZE, flexShrink: 0,
        cursor: 'pointer',
        transition: 'opacity 0.45s ease',
        opacity: highlighted ? 1 : 0.15,
      }}
    >
      <div style={{
        borderRadius: 8, overflow: 'hidden',
        transition: 'filter 0.45s ease, box-shadow 0.45s ease',
        filter: highlighted ? 'brightness(1.05)' : 'brightness(0.4)',
        boxShadow: selected
          ? '0 0 0 2.5px rgba(255,255,255,0.75), 0 6px 20px rgba(0,0,0,0.6)'
          : highlighted
            ? '0 0 0 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.5)'
            : '0 3px 8px rgba(0,0,0,0.5)',
      }}>
        <AlbumArt album={album} size={TILE_SIZE} />
      </div>
      <div style={{ width: TILE_SIZE, textAlign: 'center' }}>
        <div style={{
          fontSize: 9.5, lineHeight: 1.3, fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'color 0.45s ease',
          color: selected ? '#fff' : highlighted ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)',
        }}>
          {album.title}
        </div>
        <div style={{
          fontSize: 8.5, lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: highlighted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
          transition: 'color 0.45s ease',
        }}>
          {album.artist}
        </div>
      </div>
    </div>
  )
}
