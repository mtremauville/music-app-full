class Album < ApplicationRecord
  belongs_to :user
  has_many :songs, -> { order(:track_number) }, dependent: :destroy, inverse_of: :album

  validates :title,  presence: true
  validates :artist, presence: true
  validates :year,   presence: true, numericality: { only_integer: true, greater_than: 1900 }
  validates :hue,    presence: true
end
