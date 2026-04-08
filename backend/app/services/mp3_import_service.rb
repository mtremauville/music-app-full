require 'taglib'

class Mp3ImportService

  def self.import_file(path)
    new.send(:process_file, path)
  end

  def self.import(folder_path)
    new(folder_path).import
  end

  def initialize(folder_path = nil)
    @folder_path = folder_path
    @results     = { imported: 0, updated: 0, errors: [] }
  end

  def import
    mp3_files = Dir.glob(File.join(@folder_path, "**", "*.mp3")).sort

    if mp3_files.empty?
      @results[:errors] << "Aucun fichier MP3 trouvé dans #{@folder_path}"
      return @results
    end

    mp3_files.each { |path| process_file(path) }
    @results
  end

  private

  def process_file(path)
    tags = read_tags(path)
    return nil if tags.nil?

    album  = find_or_create_album(tags)
    is_new = !album.songs.exists?(track_number: tags[:track_number])
    song   = find_or_create_song(album, tags, path)
    song.save!
    is_new
  rescue => e
    @results&.tap { |r| r[:errors] << "#{File.basename(path)}: #{e.message}" }
    nil
  end

  def read_tags(path)
    TagLib::FileRef.open(path) do |file|
      return nil if file.null? || file.tag.nil?
      tag   = file.tag
      props = file.audio_properties

      # Compatibilité selon la version de taglib-ruby
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

  def find_or_create_album(tags)
    Album.find_or_initialize_by(title: tags[:album], artist: tags[:artist]).tap do |album|
      album.year ||= tags[:year]
      album.hue  ||= generate_hue(tags[:album])
      album.save!
    end
  end

  def find_or_create_song(album, tags, path)
    album.songs.find_or_initialize_by(track_number: tags[:track_number]).tap do |song|
      song.title     = tags[:title]
      song.duration  = tags[:duration]
      song.file_path = path
    end
  end

  def generate_hue(album_title)
    hue   = album_title.bytes.sum % 360
    sat   = 40 + (album_title.length % 25)
    light = 14 + (album_title.bytes.first % 8)
    "#{hue},#{sat}%,#{light}%"
  end
end
