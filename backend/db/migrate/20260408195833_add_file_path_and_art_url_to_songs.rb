class AddFilePathAndArtUrlToSongs < ActiveRecord::Migration[8.1]
  def change
    add_column :songs, :file_path, :string
    add_column :songs, :art_url, :string
  end
end
