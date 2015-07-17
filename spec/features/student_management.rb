require 'rails_helper'

describe "Adding a new student" do
  context "successfully" do
    before do
      @student = build(:student)
      visit root_path
      click_on "New Student"
      fill_in "First Name", with: @student.first_name
      fill_in "Last Name", with: @student.last_name
      fill_in "School", with: @student.school
      fill_in "Grade", with: @student.grade
      fill_in "Phone Number", with: @student.phone
      fill_in "Email", with: @student.email
      fill_in "Street Address", with: @student.street_address
      fill_in "City", with: @student.city
      fill_in "Postal Code", with: @student.postal_code
    end
    it "saves a new student to the database" do 
      expect{ click_button "Student" }.to change(Student, :count).by(1)
    end
    it "redirects to the index action" do
      click_button "Student"
      expect(page).to have_css "h2", text: "Students"
    end
  end
end
