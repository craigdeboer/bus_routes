angular.module('bus_routes.models.students', ["ngResource"])

  // This factory defines the connection to the back end database and is
  // referenced in the controller using the name which is the first
  // argument.
  .factory('Student', ["$resource", function($resource) {
    return $resource("/api/students/:id", {id: "@id"}, {update: {method: "PUT"}});
  }])

  // This service is used to allow other sub modules to access the students database.
  .service('StudentsModel', ["Student", function(Student) {
    var model = this;
    var students = []; // The array of students.
    var index = null;
    model.getStudents = function() {
      if (students.length !== 0) { // If the array is already populated, don't query the database.
        return students;    
      } else {
        students = Student.query(); // Otherwise, populate the array by querying the database.
        return students;
      }
    };
    
    // Add the student to the database and the students array.
    model.addStudent = function(student) {
      var addedStudent = Student.save(student); 
      students.push(addedStudent);
      console.log(students);
    };

    // Remove the student from the database and the students array.
    model.deleteStudent = function(studentId) {
      var student = model.findStudent(studentId);
      Student.remove(student);
      students.splice(index, 1);
    }; 

    // Update the student in the database and the students array.
    model.updateStudent = function(student) {
      Student.update(student);
      var updatedStudent = model.findStudent(student.id);
      students.splice(index, 1, updatedStudent);
    };

    // Find a student by id and update the index variable.
    // The index variable is used by the update and 
    // delete methods above.
    model.findStudent = function(studentId) {
      for(i = 0; i < students.length; i++) {
        var currentStudent = students[i];
        if (currentStudent.id === studentId) {
          var student = currentStudent;
          index = i;
          break;
        }
      }
      return student;
    };
  }])
;
