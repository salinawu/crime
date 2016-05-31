class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.string :address
      t.string :key_words

      t.timestamps null: false
    end
  end
end
