class StudentsController < ApplicationController
  def index
  end

  def show
  end

  def new
    @student = Student.new
  end

  def create
    @students = Student.all
    @student = Student.new(student_params)
    if @student.save
      flash[:success] =  "New Student successfully created."
      redirect_to students_path
    else
      render 'new'
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def student_params
    params.require(:student).permit(:first_name, :last_name, :school, :grade, :phone, :email, :street_address, :city, :postal_code)
  end
end
