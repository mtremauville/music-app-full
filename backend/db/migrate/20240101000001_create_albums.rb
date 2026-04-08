class CreateAlbums < ActiveRecord::Migration[8.0]
  def change
    create_table :albums do |t|
      t.string  :title,  null: false
      t.string  :artist, null: false
      t.integer :year,   null: false
      t.string  :hue,    null: false
      t.timestamps
    end
  end
end
