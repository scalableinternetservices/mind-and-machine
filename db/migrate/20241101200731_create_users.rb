class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest
      t.boolean :is_guest, default: false
      t.timestamps
    end
    add_index :users, :username, unique: true
  end
end
