class AddDetailsToStudents < ActiveRecord::Migration
  def change
    add_column :students, :comments, :text
    add_column :students, :additional_phones, :string
    add_column :students, :additional_email, :string
    add_column :students, :parent_names, :string
    add_column :students, :return_trip, :string
  end
end
