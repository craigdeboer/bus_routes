class ManageStudentsController < ApplicationController
  before_action :check_for_admin
  def home
  end

  private

  def check_for_admin
    admin_users = ["doug@ccsta.net", "debbie@ccsta.net", "craig@cdeboer.net"]
    if !user_signed_in?
      flash[:notice] = "You must be logged in to access the requested page."
      redirect_to root_path
    elsif !admin_users.include?(current_user.email)
      flash[:notice] = "You must be an admin user to access the requested page."
      redirect_to root_path 
    end
  end
      
end
