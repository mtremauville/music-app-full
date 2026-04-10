Rails.application.routes.draw do
  devise_for :users,
    path: 'api/v1/auth',
    path_names: { sign_in: 'login', sign_out: 'logout', registration: 'signup' },
    controllers: {
      sessions:      'api/v1/auth/sessions',
      registrations: 'api/v1/auth/registrations'
    }

  namespace :api do
    namespace :v1 do
      get 'me', to: 'users#me'

      resources :albums, only: [:index, :show]
      resources :songs, only: [:index, :show, :update, :destroy] do
        collection do
          get  :search
          post :import
        end
        member do
          get  :stream
          post :fetch_metadata
        end
      end
    end
  end
end
