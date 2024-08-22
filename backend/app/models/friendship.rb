class Friendship < ApplicationRecord
  belongs_to :user
  belongs_to :friend, class_name: 'User'
  belongs_to :bar, optional: true

  validates :friend_id, :user_id, presence: true
end
