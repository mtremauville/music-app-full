module Api
  module V1
    class AlbumsController < ApplicationController
      def index
        albums = Album.includes(:songs).order(:year)
        render json: albums.map { |a| serialize_album(a) }
      end

      def show
        album = Album.includes(:songs).find(params[:id])
        render json: serialize_album(album)
      end

      private

      def serialize_album(album)
        {
          id:     album.id,
          title:  album.title,
          artist: album.artist,
          year:   album.year,
          hue:    album.hue,
          tracks: album.songs.map { |s| serialize_song(s) }
        }
      end

      def serialize_song(song)
        {
          id:           song.id,
          track_number: song.track_number,
          title:        song.title,
          duration:     song.duration
        }
      end
    end
  end
end
