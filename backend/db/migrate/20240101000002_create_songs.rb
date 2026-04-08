class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.references :album,        null: false, foreign_key: true
      t.integer    :track_number, null: false
      t.string     :title,        null: false
      t.string     :duration,     null: false
      t.timestamps
    end
    add_index :songs, [:album_id, :track_number], unique: true
  end
end
