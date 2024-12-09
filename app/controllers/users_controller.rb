class UsersController < ApplicationController
  before_action :require_login, only: [:potential_chat_members]

  def index
    @users = User.all
    render json: @users, status: :ok
  end
  
  def create   
    @user = User.new(user_params)
    if @user.save
      render json: {
        message: "signup success",
        user: { id: @user.id, username: @user.username }
      }, status: :created
    else
      Rails.logger.debug "User validation failed: #{@user.errors.full_messages}"
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def search
    query = params[:q]&.strip
    
    if query.blank?
      render json: { error: "Search query cannot be empty" }, status: :bad_request
      return
    end
    
    @users = User.where("username ILIKE ? AND is_guest = ?", "%#{query}%", false)
                 .order(created_at: :desc)
    
    render json: @users.map { |user|
      {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    }
  end

  # get potential chat members except current user
  def potential_chat_members
    @users = User.where(is_guest: false)
                 .where.not(id: current_user.id)
                 .order(created_at: :desc)
    
    render json: @users.map { |user|
      {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    }
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

  private

  def user_params
    params.permit(:username, :password, :password_confirmation)
  end
end 