class AddStopDetailsToStudents < ActiveRecord::Migration
  def change
    add_column :students, :stop, :string
    add_column :students, :mon_thurs, :string
    add_column :students, :friday, :string
  end
end
