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
        q = params[:q].to_s.strip
        songs = q.present? ? Song.search(q).includes(:album) : Song.includes(:album)
        songs = songs.joins(:album).order("albums.year, songs.track_number")
        render json: songs.map { |s| serialize_song(s) }
      end

      private

      def serialize_song(song)
        {
          id:           song.id,
          track_number: song.track_number,
          title:        song.title,
          duration:     song.duration,
          album: {
            id:     song.album.id,
            title:  song.album.title,
            artist: song.album.artist,
            year:   song.album.year,
            hue:    song.album.hue,
            tracks: song.album.songs.order(:track_number).map { |t|
              { id: t.id, track_number: t.track_number, title: t.title, duration: t.duration }
            }
          }
        }
      end
    end
  end
end
