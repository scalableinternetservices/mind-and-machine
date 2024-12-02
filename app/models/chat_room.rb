class ChatRoom < ApplicationRecord
  has_many :chat_messages, dependent: :destroy
  has_many :chat_room_members, dependent: :destroy
  has_many :members, through: :chat_room_members, source: :user
  
  validates :name, presence: true
  
  def last_message
    chat_messages.order(created_at: :desc).first
  end
end 