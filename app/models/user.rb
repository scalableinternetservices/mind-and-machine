class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    has_many :comments, dependent: :destroy
    has_many :chat_room_members, dependent: :destroy
    has_many :chat_rooms, through: :chat_room_members
    has_many :chat_messages, dependent: :destroy
    
    has_secure_password
  end