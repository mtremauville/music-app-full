class AddUserToSongs < ActiveRecord::Migration[8.1]

  def up
    # Songs héritent du user via album — pas besoin de user_id direct sur songs
    # La relation passe par album.user
  end

  def down
  end
end
