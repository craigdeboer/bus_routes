class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :first_name
      t.string :last_name
      t.string :school
      t.integer :grade
      t.string :phone
      t.string :email
      t.text :street_address
      t.string :city
      t.string :postal_code
      t.integer :bus_route

      t.timestamps null: false
    end
  end
end
