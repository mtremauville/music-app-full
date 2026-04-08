import WallTile from './WallTile.jsx'

const TILE_SIZE = 74

export default function Wall({ songs, matchedIds }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 380 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${TILE_SIZE}px, 1fr))`, gap: 9, padding: '16px 14px 0' }}>
        {songs.map(song => (
          <WallTile key={song.id} song={song} highlighted={!matchedIds || matchedIds.has(song.id)} />
        ))}
      </div>
    </div>
  )
}
