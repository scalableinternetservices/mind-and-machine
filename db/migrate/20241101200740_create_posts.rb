class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.integer :likes, array: true, default: []
      t.timestamps
    end
  end
end
