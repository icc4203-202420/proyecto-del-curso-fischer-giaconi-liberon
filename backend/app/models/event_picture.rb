class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  
  has_many :taggings
  has_many :tagged_users, through: :taggings, source: :user
  
  has_one_attached :image  # Relación con ActiveStorage
end
