module Api
  class StudentsController < ApplicationController
    before_action :check_for_admin
    def index
      @students = Student.all
      render json: @students
    end

    def show
    end

    def new
      @student = Student.new
    end

    def create
      student = Student.new(student_params)
      if student.save
        render json: student, status: 201
      else
        render json: student.errors.full_messages
      end
    end

    def edit
    end

    def update
      student = Student.find(params[:id])
      student.update(student_params)
      render nothing: true, status: 201
    end

    def destroy
      student = Student.find(params[:id])
      student.destroy
      render nothing: true, status: 201
    end

    private

    def student_params
      params.require(:student).permit(:first_name, :last_name, :school, :grade, :phone, :email, :street_address, :city, :postal_code, :additional_phones, :bus_route, :return_trip, :additional_email, :comments, :parent_names, :stop, :mon_thurs, :friday, :latitude, :longitude)
    end

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
end
