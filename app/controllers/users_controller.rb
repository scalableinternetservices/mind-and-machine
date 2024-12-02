class UsersController < ApplicationController
  before_action :require_login, only: [:potential_chat_members]

  def index
    @users = User.all
    render json: @users, status: :ok
  end
  
  def create   
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
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
    
    @users = User.where("username ILIKE ?", "%#{query}%")
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
    @users = User.where.not(id: current_user.id)
                 .order(username: :asc)
    
    render json: @users.map { |user|
      {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    }
  end

  private

  def user_params
    params.permit(:username, :password, :password_confirmation)
  end
end 