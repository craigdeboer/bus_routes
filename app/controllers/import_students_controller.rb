class ImportStudentsController < ApplicationController

  before_action :check_for_admin
  def new
  end

  def langley_import
  end

  def standard_import
    Student.standard_import(params[:file])
    flash[:success] = "Students Imported"
    redirect_to new_import_path
  end
  
  private

  def check_for_admin
    admin_users = ["doug@ccsta.net", "debbie@ccsta.net", "craig@cdeboer.net", "user@foo.com"]
    if !user_signed_in?
      flash[:notice] = "You must be logged in to access the requested page."
      redirect_to root_path
    elsif !admin_users.include?(current_user.email)
      flash[:notice] = "You must be an admin user to access the requested page."
      redirect_to root_path 
    end
  end
end
