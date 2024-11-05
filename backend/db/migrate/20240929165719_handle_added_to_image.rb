class HandleAddedToImage < ActiveRecord::Migration[7.1]
  def change
    add_column :event_pictures, :handle, :string
  end
end
