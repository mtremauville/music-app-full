module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              message: 'Compte créé avec succès.',
              user: serialize_user(resource)
            }, status: :created
          else
            render json: {
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def serialize_user(user)
          { id: user.id, email: user.email, username: user.username }
        end
      end
    end
  end
end
