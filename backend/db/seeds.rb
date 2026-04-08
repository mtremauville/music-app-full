# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
puts "Nettoyage..."
Song.delete_all
Album.delete_all

ALBUMS_DATA = [
  {
    title: "A Night at the Opera", artist: "Queen", year: 1975, hue: "355,65%,22%",
    tracks: [
      { n: 1, title: "Death on Two Legs",     dur: "3:44" },
      { n: 2, title: "Bohemian Rhapsody",      dur: "5:55" },
      { n: 3, title: "You're My Best Friend",  dur: "2:52" },
      { n: 4, title: "Love of My Life",         dur: "3:38" },
      { n: 5, title: "The Prophet's Song",      dur: "8:17" },
    ]
  },
  {
    title: "Hotel California", artist: "Eagles", year: 1977, hue: "142,42%,16%",
    tracks: [
      { n: 1, title: "Hotel California",       dur: "6:30" },
      { n: 2, title: "Life in the Fast Lane",  dur: "4:46" },
      { n: 3, title: "Wasted Time",            dur: "4:55" },
      { n: 4, title: "Victim of Love",         dur: "4:09" },
      { n: 5, title: "The Last Resort",        dur: "7:25" },
    ]
  },
  {
    title: "Thriller", artist: "Michael Jackson", year: 1982, hue: "28,62%,16%",
    tracks: [
      { n: 1, title: "Wanna Be Startin' Somethin'", dur: "6:03" },
      { n: 2, title: "Thriller",                    dur: "5:57" },
      { n: 3, title: "Beat It",                     dur: "4:18" },
      { n: 4, title: "Billie Jean",                 dur: "4:54" },
      { n: 5, title: "Human Nature",                dur: "4:06" },
    ]
  },
  {
    title: "Discovery", artist: "Daft Punk", year: 2001, hue: "46,65%,16%",
    tracks: [
      { n: 1, title: "One More Time",         dur: "5:20" },
      { n: 2, title: "Harder Better Faster",  dur: "3:45" },
      { n: 3, title: "Around the World",      dur: "7:09" },
      { n: 4, title: "Digital Love",          dur: "4:58" },
      { n: 5, title: "Instant Crush",         dur: "5:37" },
    ]
  },
  {
    title: "Rumours", artist: "Fleetwood Mac", year: 1977, hue: "316,36%,16%",
    tracks: [
      { n: 1, title: "Second Hand News", dur: "2:43" },
      { n: 2, title: "Dreams",           dur: "4:17" },
      { n: 3, title: "The Chain",        dur: "4:30" },
      { n: 4, title: "Go Your Own Way",  dur: "3:38" },
      { n: 5, title: "Gold Dust Woman",  dur: "4:51" },
    ]
  },
  {
    title: "The Wall", artist: "Pink Floyd", year: 1979, hue: "208,48%,15%",
    tracks: [
      { n: 1, title: "Another Brick in the Wall", dur: "3:11" },
      { n: 2, title: "Comfortably Numb",          dur: "6:23" },
      { n: 3, title: "Hey You",                   dur: "4:40" },
      { n: 4, title: "Run Like Hell",             dur: "4:20" },
      { n: 5, title: "Nobody Home",               dur: "3:26" },
    ]
  },
].freeze

ALBUMS_DATA.each do |data|
  album = Album.create!(title: data[:title], artist: data[:artist], year: data[:year], hue: data[:hue])
  data[:tracks].each { |t| album.songs.create!(track_number: t[:n], title: t[:title], duration: t[:dur]) }
  puts "  ✓ #{album.artist} – #{album.title}"
end

puts "\n✅ #{Album.count} albums, #{Song.count} chansons."
