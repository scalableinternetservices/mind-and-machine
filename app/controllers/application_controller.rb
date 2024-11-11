# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :require_login
  helper_method :current_user
  
  private
  
  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
  
  def require_login
    unless current_user
      redirect_to login_path
    end
  end
end