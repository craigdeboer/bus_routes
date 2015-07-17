require 'rails_helper'

RSpec.describe Student, type: :model do
  before do
   @student =  build(:student) 
  end
  it "should respond to the right attributes" do 
    expect(@student).to respond_to(:first_name, :last_name, :school, :grade, :phone, :email, :street_address, :city, :postal_code, :bus_route)
  end
  it "is valid with a first_name, last_name, school, grade, phone_number, email, street_address, city, postal_code, and bus_route" do
    expect(@student).to be_valid
  end
  it "is invalid without a first_name" do
    @student.first_name = ""
    expect(@student).to_not be_valid
  end
  it "is invalid with a first_name that is too long" do
    @student.first_name = "edgar" * 11
    expect(@student).to_not be_valid
  end
  it "is invalid without a last_name" do
    @student.last_name = ""
    expect(@student).to_not be_valid
  end
  it "is invalid with a last_name that is too long" do
    @student.first_name = "edgar" * 11
    expect(@student).to_not be_valid
  end
  it "is invalid without a school" do
    @student.school = ""
    expect(@student).to_not be_valid
  end
  it "is invalid without a grade" do
    @student.grade = ""
    expect(@student).to_not be_valid
  end
  it "is invalid with a grade that is a number that is not between 1 and 12" do
    @student.grade = 13
    expect(@student).to_not be_valid
  end
  it "is invalid with a grade that is not a number" do
    @student.grade = "a"
    expect(@student).to_not be_valid
  end
  it "is invalid without a phone" do
    @student.phone = ""
    expect(@student).to_not be_valid
  end
  it "is invalid without an email" do 
    @student.email = ""
    expect(@student).to_not be_valid
  end
  it "is invalid with an email with an invalid format" do
    valid_addresses = %w(user@example,com user_at_foo.org user.name@example.
                      foo@bar_baz.com foo@bar+baz.com)
    valid_addresses.each do |address|
      @student.email = address
      expect(@student).to_not be_valid
    end
  end
  it "is valid with an email with a valid format" do
    valid_addresses = %w(user@example.com USER@foo.COM A_US-ER@foo.bar.org
                         first.last@foo.jp alice+bob@baz.cn)
    valid_addresses.each do |address|
      @student.email = address
      expect(@student).to be_valid
    end
  end
  it "is invalid without a street_address" do
    @student.street_address = ""
    expect(@student).to_not be_valid
  end
  it "is invalid without a city" do
    @student.city = ""
    expect(@student).to_not be_valid
  end
  it "is invalid without a postal_code" do
    @student.postal_code = ""
    expect(@student).to_not be_valid
  end
end
