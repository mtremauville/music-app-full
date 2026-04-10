class AddUserToAlbums < ActiveRecord::Migration[8.1]

  def up
    # Ajout nullable d'abord
    add_reference :albums, :user, null: true, foreign_key: true

    # Crée un user par défaut pour les albums orphelins
    if Album.exists?
      default_user = User.first_or_create!(
        email:    "admin@musicapp.local",
        username: "admin",
        password: "password123"
      )
      Album.where(user_id: nil).update_all(user_id: default_user.id)
    end

    # Maintenant on peut contraindre NOT NULL
    change_column_null :albums, :user_id, false
  end

  def down
    remove_reference :albums, :user
  end
end
