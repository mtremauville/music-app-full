Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
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
