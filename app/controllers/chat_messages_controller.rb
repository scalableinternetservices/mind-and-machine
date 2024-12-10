class ChatMessagesController < ApplicationController
  before_action :require_login
  before_action :set_chat_room
  before_action :check_membership
  
  def index
    @messages = @chat_room.chat_messages.all.order(created_at: :desc)
    
    render json: @messages.map { |message|
      {
        id: message.id,
        content: message.content,
        user: {
          id: message.user.id,
          username: message.user.username
        },
        chatId: @chat_room.id,
        created_at: message.created_at
      }
    }
  end

  def create
    @message = @chat_room.chat_messages.build(message_params)
    @message.user = current_user
    
    if @message.save
      render json: {
        id: @message.id,
        content: @message.content,
        user: {
          id: @message.user.id,
          username: @message.user.username
        },
        chatId: @chat_room.id,
        created_at: @message.created_at
      }, status: :created
    else
      render json: { errors: @message.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_chat_room
    @chat_room = ChatRoom.find_by(id: params[:chat_id])
    unless @chat_room
      render json: { error: "Chat room not found" }, status: :not_found
    end
  end

  def message_params
    params.permit(:content)
  end

  def check_membership
    unless @chat_room.members.include?(current_user)
      render json: { error: "You are not a member of this chat room" }, status: :forbidden
    end
  end
end 