class SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { 
        message: "login success",
        user: { id: user.id, username: user.username }
      }
    else
      render json: { error: "username or password is incorrect" }, status: :unauthorized
    end
  end
  
  def destroy
    session.delete(:user_id)
    render json: { message: "logout success" }
  end
end