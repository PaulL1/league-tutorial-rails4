class UnlocksController < Devise::UnlocksController

  protected

  def after_unlock_path_for(resource)
    '/UI/index.html#login?message=unlock'
  end

end