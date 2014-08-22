class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie_for_ng
  
  def intercept_html_requests
    redirect_to('/') if request.format == Mime::HTML
  end 
  
  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end
  
  rescue_from ActionController::InvalidAuthenticityToken do |exception|
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    message = 'Rails CSRF token error, please try again'
    render_with_protection(message.to_json, {:status => :unprocessable_entity}) 
  end
    
  def render_with_protection(object, parameters = {})
    render parameters.merge(content_type: 'application/json', text: ")]}',\n" + object.to_json)
  end

protected

  def verified_request?
    super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
  end

end
