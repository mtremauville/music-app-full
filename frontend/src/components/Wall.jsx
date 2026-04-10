import AlbumTile from './AlbumTile.jsx'

const TILE_SIZE = 86

export default function Wall({ albums, highlightedAlbumIds, selectedAlbumId, onAlbumClick }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: 380,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${TILE_SIZE}px, 1fr))`,
        gap: 12,
        padding: '68px 14px 0',
      }}>
        {albums.map(album => (
          <AlbumTile
            key={album.id}
            album={album}
            highlighted={!highlightedAlbumIds || highlightedAlbumIds.has(album.id)}
            selected={selectedAlbumId === album.id}
            onClick={() => onAlbumClick?.(album)}
          />
        ))}
      </div>
    </div>
  )
}
