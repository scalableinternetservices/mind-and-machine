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

  def ensure_guest_user
    return User.guest if User.guest.present?

    # Create guest user if it doesn't exist
    guest = User.new(
      username: '[Guest]',
      password: SecureRandom.hex(32),
      is_guest: true
    )

    if guest.save
      Rails.logger.info "Guest user created successfully"
      guest
    else
      Rails.logger.error "Failed to create guest user: #{guest.errors.full_messages.join(', ')}"
      nil
    end
  end

end