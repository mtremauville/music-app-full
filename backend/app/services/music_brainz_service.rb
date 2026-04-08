require 'net/http'
require 'json'

class MusicBrainzService
  BASE_URL   = "https://musicbrainz.org/ws/2"
  COVER_URL  = "https://coverartarchive.org"
  USER_AGENT = "MusicCoverFlow/1.0 (contact@tremic.fr)"

  def self.search(title:, artist: nil)
    new.search(title: title, artist: artist)
  end

  def search(title:, artist: nil)
    # Essai 1 : titre + artiste
    result = try_search(title: title, artist: artist)
    return result if result&.dig(:art_url)

    # Essai 2 : titre seul (au cas où l'artiste est écrit différemment)
    result = try_search(title: title, artist: nil)
    return result if result&.dig(:art_url)

    # Essai 3 : retourne quand même le résultat sans pochette
    result
  rescue => e
    Rails.logger.error "MusicBrainz error: #{e.message}"
    nil
  end

  private

  def try_search(title:, artist:)
    recordings = fetch_recordings(title: title, artist: artist)
    return nil if recordings.nil? || recordings.empty?

    # Essaie plusieurs releases pour trouver une pochette
    recordings.first(3).each do |recording|
      recording.dig("releases")&.first(3)&.each do |release|
        release_id = release["id"]
        next unless release_id

        art_url = fetch_cover_art(release_id)

        return {
          title:   recording["title"],
          artist:  recording.dig("artist-credit", 0, "artist", "name"),
          album:   release["title"],
          year:    extract_year(release),
          art_url: art_url,
        }
      end
    end

    # Aucune pochette trouvée — retourne quand même les métadonnées
    recording = recordings.first
    release   = recording.dig("releases", 0)
    return nil unless release

    {
      title:   recording["title"],
      artist:  recording.dig("artist-credit", 0, "artist", "name"),
      album:   release["title"],
      year:    extract_year(release),
      art_url: nil,
    }
  end

  def fetch_recordings(title:, artist:)
    query = "recording:\"#{title}\""
    query += " AND artist:\"#{artist}\"" if artist.present?

    uri = URI("#{BASE_URL}/recording")
    uri.query = URI.encode_www_form(
      query: query,
      fmt:   "json",
      limit: 5,
      inc:   "releases artist-credits"
    )

    data = get_json(uri)
    data&.dig("recordings")
  end

  def fetch_cover_art(release_id)
    # Essai 1 : front-250
    url = try_cover_url("#{COVER_URL}/release/#{release_id}/front-250")
    return url if url

    # Essai 2 : index JSON de la release
    uri  = URI("#{COVER_URL}/release/#{release_id}")
    data = get_json(uri)
    img  = data&.dig("images")&.find { |i| i["front"] }
    img&.dig("thumbnails", "250") || img&.dig("image")
  rescue
    nil
  end

  def try_cover_url(url)
    uri      = URI(url)
    http     = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl     = true
    http.read_timeout = 5
    http.open_timeout = 5

    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = USER_AGENT

    res = http.request(req)

    # Suit la redirection
    if res.is_a?(Net::HTTPRedirection)
      return res["location"]
    end

    res.is_a?(Net::HTTPSuccess) ? url : nil
  rescue
    nil
  end

  def extract_year(release)
    date = release["date"] || release.dig("release-events", 0, "date")
    date&.split("-")&.first&.to_i
  end

  def get_json(uri)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl      = true
    http.read_timeout = 8
    http.open_timeout = 5

    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = USER_AGENT
    req["Accept"]     = "application/json"

    res = http.request(req)
    return nil unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)
  rescue => e
    Rails.logger.error "HTTP error #{uri}: #{e.message}"
    nil
  end
end
