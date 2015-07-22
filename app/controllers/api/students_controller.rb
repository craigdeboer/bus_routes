module Api
  class StudentsController < ApplicationController
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
      student.save
      render json: student, status: 201
    end

    def edit
    end

    def update
    end

    def destroy
      byebug
      student = Student.find(params[:id])
      student.destroy
      render nothing: true, status: 201
    end

    private

    def student_params
      params.require(:student).permit(:first_name, :last_name, :school, :grade, :phone, :email, :street_address, :city, :postal_code)
    end
  end
end
