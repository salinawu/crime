class CreateWebScrapers < ActiveRecord::Migration
  def change
    create_table :web_scrapers do |t|

      t.timestamps null: false
    end
  end
end
