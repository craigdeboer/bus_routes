class ChangeLatAndLongToDecimalInStudents < ActiveRecord::Migration
  def change
    change_column :students, :latitude, :decimal, :precision => 11, :scale => 8
    change_column :students, :longitude, :decimal, :precision => 11, :scale => 8
  end
end
