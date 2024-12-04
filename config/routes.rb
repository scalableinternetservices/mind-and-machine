Rails.application.routes.draw do
  # API routes
  scope '/api' do
    post '/signup', to: 'users#create'
    post '/login',  to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/users', to: 'users#index'
    # search routes
    get '/search/users', to: 'users#search'
    get '/search/posts', to: 'posts#search'
    
    # user posts routes
    get '/user/:user_id/posts', to: 'posts#user_posts'
    get '/user/:user_id/liked_posts', to: 'posts#liked_posts'
    
    resources :posts do
      member do
        post 'like'
        delete 'unlike'
      end
      
      resources :comments, only: [:create, :update, :destroy]
    end
    
    resources :chats, controller: 'chat_rooms' do
      resources :messages, controller: 'chat_messages', only: [:index, :create]
    end
    
    # get potential chat members route
    get '/users/potential_chat_members', to: 'users#potential_chat_members'
  end

  root to: proc { [200, {}, ['Mind and Machine API Server']] }
end