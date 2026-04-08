import AlbumArt from './AlbumArt.jsx'

const TILE_SIZE = 74

export default function WallTile({ song, highlighted }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: TILE_SIZE, flexShrink: 0, transition: 'opacity 0.45s ease', opacity: highlighted ? 1 : 0.18 }}>
      <div style={{ borderRadius: 7, overflow: 'hidden', transition: 'filter 0.45s ease, box-shadow 0.45s ease', filter: highlighted ? 'brightness(1.08)' : 'brightness(0.45)', boxShadow: highlighted ? '0 0 0 1.5px rgba(255,255,255,0.32), 0 4px 14px rgba(0,0,0,0.5)' : '0 3px 8px rgba(0,0,0,0.5)' }}>
        <AlbumArt album={song.album} size={TILE_SIZE} />
      </div>
      <span style={{ fontSize: 9, lineHeight: 1.25, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: TILE_SIZE, transition: 'color 0.45s ease', color: highlighted ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)' }}>
        {song.title}
      </span>
    </div>
  )
}
