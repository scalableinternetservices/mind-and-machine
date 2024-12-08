class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token
  
  private
  
  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    !current_user.nil?
  end

  def require_login
    unless logged_in?
      render json: { error: "login required" }, status: :unauthorized
    end
  end
end