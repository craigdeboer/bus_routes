class Student < ActiveRecord::Base
  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :school, presence: true
  validates :grade, presence: true, inclusion: { in: 1..12 }
  validates :street_address, presence: true
  validates :city, presence: true

  geocoded_by :full_address
  after_validation :geocode, if: :street_address_changed?

  def self.standard_import(file)
    spreadsheet = Roo::Excelx.new(file.path)
    (1..spreadsheet.last_row).each do |row|
      comments = spreadsheet.cell(row, 1)
      school = spreadsheet.cell(row, 2)
      bus_route = spreadsheet.cell(row, 3)
      first_name = spreadsheet.cell(row, 4)
      last_name = spreadsheet.cell(row, 5)
      temp_grade = spreadsheet.cell(row, 6)
      stop = spreadsheet.cell(row, 10)
      mon_thurs = spreadsheet.cell(row, 11)
      friday = spreadsheet.cell(row, 12)
      phone = spreadsheet.cell(row, 13)
      additional_phones = spreadsheet.cell(row, 14)
      email = spreadsheet.cell(row, 15)
      additional_email = spreadsheet.cell(row, 16)
      parent_names = spreadsheet.cell(row, 17)
      street_address = spreadsheet.cell(row, 18)
      city = spreadsheet.cell(row, 19)
      postal_code = spreadsheet.cell(row, 20)
      return_trip = spreadsheet.cell(row, 21)
      if temp_grade == "K" || temp_grade == "k"
        grade = 0
      else
        grade = temp_grade
      end
      student = Student.new(first_name: first_name, last_name: last_name, school: school, 
                            grade: grade, phone: phone, email: email, street_address: street_address, 
                            city: city, postal_code: postal_code, bus_route: bus_route,
                            additional_phones: additional_phones, additional_email: additional_email,
                            parent_names: parent_names, return_trip: return_trip,
                            comments: comments, stop: stop, mon_thurs: mon_thurs, friday: friday,
                            return_trip: return_trip)
      student.save!
    end
  end
  private

  def full_address
    address = [self.street_address, self.city, "BC", "Canada"].join(', ')
  end
end
