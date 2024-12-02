class CreateChatMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_messages do |t|
      t.text :content, null: false
      t.references :user, foreign_key: true
      t.references :chat_room, foreign_key: true
      t.timestamps
    end
  end
end 