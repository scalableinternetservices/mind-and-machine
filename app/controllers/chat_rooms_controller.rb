class ChatRoomsController < ApplicationController
  skip_forgery_protection
  before_action :require_login
  before_action :set_chat_room, only: [:show]
  before_action :check_membership, only: [:show]

  def index
    @chat_rooms = current_user.chat_rooms.all
    
    render json: @chat_rooms.map { |room|
      {
        id: room.id,
        name: room.name,
        created_at: room.created_at,
        members: room.members.map { |member|
          {
            id: member.id,
            username: member.username
          }
        },
        lastMessage: room.last_message && {
          id: room.last_message.id,
          content: room.last_message.content,
          user: {
            id: room.last_message.user.id,
            username: room.last_message.user.username
          },
          chatId: room.id,
          created_at: room.last_message.created_at
        }
      }
    }, status: :ok
  end

  def show
    render json: {
      id: @chat_room.id,
      name: @chat_room.name,
      created_at: @chat_room.created_at,
      members: @chat_room.members.map { |member|
        {
          id: member.id,
          username: member.username
        }
      }
    }
  end

  def create
    @chat_room = ChatRoom.new(chat_room_params)
    
    if @chat_room.save
      # add creator as member
      if !@chat_room.members.include?(current_user)
        @chat_room.members << current_user
      end
      # add other members
      if params[:member_ids].present?
        User.where(id: params[:member_ids]).each do |user|
          @chat_room.members << user unless user.id == current_user.id
        end
      end
      
      render json: {
        id: @chat_room.id,
        name: @chat_room.name,
        created_at: @chat_room.created_at,
        members: @chat_room.members.map { |member|
          {
            id: member.id,
            username: member.username
          }
        }
      }, status: :created
    else
      render json: { errors: @chat_room.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_chat_room
    @chat_room = ChatRoom.find_by(id: params[:id])
    unless @chat_room
      render json: { error: "Chat room not found" }, status: :not_found
    end
  end

  def chat_room_params
    params.permit(:name)
  end

  def check_membership
    unless @chat_room.members.include?(current_user)
      render json: { error: "You are not a member of this chat room" }, status: :forbidden
    end
  end
end 