require 'taglib'

class Mp3ImportService
  def self.import_file(path, user)
    new.send(:process_file, path, user)
  end

  private

  def process_file(path, user)
    tags = read_tags(path)
    return nil if tags.nil?

    album  = user.albums.find_or_initialize_by(title: tags[:album], artist: tags[:artist])
    album.year ||= tags[:year]
    album.hue  ||= generate_hue(tags[:album])
    album.save!

    is_new = !album.songs.exists?(track_number: tags[:track_number])
    song   = album.songs.find_or_initialize_by(track_number: tags[:track_number])
    song.title     = tags[:title]
    song.duration  = tags[:duration]
    song.file_path = path
    song.save!
    is_new
  rescue => e
    Rails.logger.error "Import error #{path}: #{e.message}"
    raise
  end

  def read_tags(path)
    TagLib::FileRef.open(path) do |file|
      return nil if file.null? || file.tag.nil?
      tag   = file.tag
      props = file.audio_properties
      seconds = if props.respond_to?(:length_in_seconds)
                  props.length_in_seconds
                elsif props.respond_to?(:length)
                  props.length
                else
                  0
                end
      {
        title:        tag.title.presence   || File.basename(path, ".mp3"),
        artist:       tag.artist.presence  || "Artiste inconnu",
        album:        tag.album.presence   || "Album inconnu",
        year:         tag.year > 0         ? tag.year : Time.current.year,
        track_number: tag.track > 0        ? tag.track : 1,
        duration:     format_duration(seconds),
      }
    end
  rescue => e
    Rails.logger.error "Cannot read tags for #{path}: #{e.message}"
    nil
  end

  def format_duration(seconds)
    return "0:00" if seconds.nil? || seconds == 0
    "#{seconds / 60}:#{(seconds % 60).to_s.rjust(2, '0')}"
  end

  def generate_hue(album_title)
    hue   = album_title.bytes.sum % 360
    sat   = 40 + (album_title.length % 25)
    light = 14 + (album_title.bytes.first % 8)
    "#{hue},#{sat}%,#{light}%"
  end
end
