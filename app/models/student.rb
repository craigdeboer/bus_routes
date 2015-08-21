class Student < ActiveRecord::Base
  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :school, presence: true
  validates :grade, presence: true, inclusion: { in: 1..12 }
  validates :phone, presence: true
  validates :street_address, presence: true
  validates :city, presence: true
  validates :postal_code, presence: true

  geocoded_by :full_address
  after_validation :geocode, if: :street_address_changed?

  def self.standard_import(file)
    spreadsheet = Roo::Excelx.new(file.path)
    (1..spreadsheet.last_row).each do |row|
      school = spreadsheet.cell(row, 1)
      bus_route = spreadsheet.cell(row, 2)
      last_name = spreadsheet.cell(row, 3)
      first_name = spreadsheet.cell(row, 4)
      grade = spreadsheet.cell(row, 5)
      phone = spreadsheet.cell(row, 6)
      additional_phones = spreadsheet.cell(row, 7)
      email = spreadsheet.cell(row, 8)
      additional_email = spreadsheet.cell(row, 9)
      parent_names = spreadsheet.cell(row, 10)
      street_address = spreadsheet.cell(row, 11)
      city = spreadsheet.cell(row, 12)
      postal_code = spreadsheet.cell(row, 13)
      return_trip = spreadsheet.cell(row, 14)
      student = Student.new(first_name: first_name, last_name: last_name, school: school, 
                            grade: grade, phone: phone, email: email, street_address: street_address, 
                            city: city, postal_code: postal_code, bus_route: bus_route,
                            additional_phones: additional_phones, additional_email: additional_email,
                            parent_names: parent_names, return_trip: return_trip)
      student.save!
    end
  end
  private

  def full_address
    address = [self.street_address, self.city, "BC", "Canada"].join(', ')
  end
end
