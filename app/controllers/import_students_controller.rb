class ImportStudentsController < ApplicationController

  def new
  end

  def langley_import
  end

  def standard_import
    Student.standard_import(params[:file])
    flash[:success] = "Students Imported"
    redirect_to new_import_path
  end
end
