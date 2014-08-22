LeagueTutorialRails4::Application.routes.draw do
  devise_for :users, :controllers => {confirmations: 'confirmations', unlocks: 'unlocks'}

  root to: 'home#index'
  resources :clubs, :except => [:new, :edit]
  resources :teams, :except => [:new, :edit]
end