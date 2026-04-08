class AddArtUrlToAlbums < ActiveRecord::Migration[8.1]
  def change
    add_column :albums, :art_url, :string
  end
end
