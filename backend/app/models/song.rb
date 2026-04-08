class Song < ApplicationRecord
  belongs_to :album

  validates :title,        presence: true
  validates :duration,     presence: true
  validates :track_number, presence: true,
                           numericality: { only_integer: true, greater_than: 0 },
                           uniqueness: { scope: :album_id }

  scope :search, ->(query) {
    q = "%#{query.downcase}%"
    joins(:album).where(
      "LOWER(songs.title) LIKE :q
       OR LOWER(albums.title) LIKE :q
       OR LOWER(albums.artist) LIKE :q
       OR CAST(albums.year AS TEXT) LIKE :q",
      q: q
    )
  }

  def streamable?
    file_path.present? && File.exist?(file_path)
  end
end
