class CreateChatRoomMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_room_members do |t|
      t.references :user, foreign_key: true
      t.references :chat_room, foreign_key: true
      t.timestamps
    end
    
    add_index :chat_room_members, [:user_id, :chat_room_id], unique: true
  end
end 