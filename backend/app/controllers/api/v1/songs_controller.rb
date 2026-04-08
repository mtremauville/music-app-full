module Api
  module V1
    class SongsController < ApplicationController

      def index
        songs = Song.includes(:album).joins(:album).order("albums.year, songs.track_number")
        render json: songs.map { |s| serialize_song(s) }
      end

      def show
        song = Song.includes(:album).find(params[:id])
        render json: serialize_song(song)
      end

      def search
        q     = params[:q].to_s.strip
        songs = q.present? ? Song.search(q).includes(:album) : Song.includes(:album)
        songs = songs.joins(:album).order("albums.year, songs.track_number")
        render json: songs.map { |s| serialize_song(s) }
      end

      def import
        uploaded = params[:files]

        if uploaded.blank?
          render json: { error: "Aucun fichier reçu" }, status: :unprocessable_entity
          return
        end

        storage_dir = Rails.root.join("storage", "music")
        FileUtils.mkdir_p(storage_dir)

        results = { imported: 0, updated: 0, errors: [] }

        Array(uploaded).each do |file|
          next unless file.respond_to?(:original_filename)
          next unless file.original_filename.end_with?(".mp3")

          dest_path = storage_dir.join(file.original_filename).to_s
          File.binwrite(dest_path, file.read) unless File.exist?(dest_path)

          begin
            is_new = Mp3ImportService.import_file(dest_path)
            is_new ? results[:imported] += 1 : results[:updated] += 1
          rescue => e
            results[:errors] << "#{file.original_filename}: #{e.message}"
            File.delete(dest_path) if File.exist?(dest_path)
          end
        end

        render json: results, status: :ok
      end

      def stream
        song = Song.find(params[:id])
        unless song.streamable?
          render json: { error: "Fichier audio introuvable" }, status: :not_found
          return
        end
        send_file song.file_path,
                  type:        "audio/mpeg",
                  disposition: "inline",
                  filename:    File.basename(song.file_path)
      end

      def fetch_metadata
        song   = Song.find(params[:id])
        result = MusicBrainzService.search(title: song.title, artist: song.album.artist)

        if result.nil?
          render json: { error: "Aucune métadonnée trouvée" }, status: :not_found
          return
        end

        song.album.update(art_url: result[:art_url]) if result[:art_url]
        song.update(art_url: result[:art_url])
        render json: serialize_song(song.reload)
      end

      def destroy
        song = Song.find(params[:id])
        album = song.album
        song.destroy
        # Supprime l'album si plus aucune chanson
        album.destroy if album.songs.empty?
        render json: { deleted: true }, status: :ok
      end

      def update
        song = Song.find(params[:id])
        if song.update(song_params)
          if params[:song][:album_title].present? || params[:song][:artist].present?
            song.album.update(
              title:  params[:song][:album_title] || song.album.title,
              artist: params[:song][:artist]      || song.album.artist,
              year:   params[:song][:year]         || song.album.year,
            )
          end
          render json: serialize_song(song.reload)
        else
          render json: { errors: song.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      private

      def song_params
        params.require(:song).permit(:title, :duration, :track_number, :art_url)
      end

      def serialize_song(song)
        {
          id:           song.id,
          track_number: song.track_number,
          title:        song.title,
          duration:     song.duration,
          art_url:      song.art_url,
          stream_url:   song.streamable? ? "http://localhost:3001/api/v1/songs/#{song.id}/stream" : nil,
          album: {
            id:      song.album.id,
            title:   song.album.title,
            artist:  song.album.artist,
            year:    song.album.year,
            hue:     song.album.hue,
            art_url: song.album.art_url,
            tracks:  song.album.songs.order(:track_number).map { |t|
              { id: t.id, track_number: t.track_number, title: t.title, duration: t.duration }
            }
          }
        }
      end
    end
  end
end
