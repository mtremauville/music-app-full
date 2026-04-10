class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :albums, dependent: :destroy
  has_many :songs,  through: :albums

  validates :username, presence: true, uniqueness: true, length: { minimum: 2 }
end
