module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            message: 'Connexion réussie.',
            user: { id: resource.id, email: resource.email, username: resource.username }
          }, status: :ok
        end

        def respond_to_on_destroy
          if current_user
            render json: { message: 'Déconnexion réussie.' }, status: :ok
          else
            render json: { message: 'Token invalide.' }, status: :unauthorized
          end
        end
      end
    end
  end
end
