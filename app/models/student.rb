class Student < ActiveRecord::Base
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :school, presence: true
  validates :grade, presence: true, inclusion: { in: 1..12 }
  validates :phone, presence: true
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :street_address, presence: true
  validates :city, presence: true
  validates :postal_code, presence: true
end
