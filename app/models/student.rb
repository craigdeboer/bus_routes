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

  geocoded_by :full_address
  after_validation :geocode, if: :street_address_changed?

  def self.standard_import(file)
    spreadsheet = Roo::Excelx.new(file.path)
    (1..spreadsheet.last_row).each do |row|
      first_name = spreadsheet.cell(row, 1)
      last_name = spreadsheet.cell(row, 2)
      school = spreadsheet.cell(row, 3)
      grade = spreadsheet.cell(row, 4)
      phone = spreadsheet.cell(row, 5)
      email = spreadsheet.cell(row, 6)
      street_address = spreadsheet.cell(row, 7)
      city = spreadsheet.cell(row, 8)
      postal_code = spreadsheet.cell(row, 9)
      bus_route = spreadsheet.cell(row, 10)
      student = Student.new(first_name: first_name, last_name: last_name, school: school, 
                            grade: grade, phone: phone, email: email, street_address: street_address, 
                            city: city, postal_code: postal_code, bus_route: bus_route)
      student.save!
    end
  end
  private

  def full_address
    address = [self.street_address, self.city, "BC", "Canada"].join(', ')
  end
end
