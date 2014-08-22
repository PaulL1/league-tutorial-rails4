class ConfirmationsController < Devise::ConfirmationsController

  protected

  def after_confirmation_path_for(resource_name, resource)
    '/UI/index.html#login?message=confirm'
  end

end