angular.module('bus_routes.students', [])
  
  .controller('StudentCrudCtrl', ["$scope", "Shared", "StudentsModel", "StudentMarkers", function($scope, Shared, StudentsModel, StudentMarkers) {
    
    $scope.shared = Shared;
    $scope.formDisplay = false;
    $scope.showDetails = false;
    $scope.firstOrderSelecton = "last_name";
    loadStudents();
    
    // Define scoped functions.
    $scope.deleteRouteFilter = deleteRouteFilter;
    $scope.removeStudent = removeStudent;
    $scope.editStudent = editStudent;
    $scope.updateStudent = updateStudent;
    $scope.addNewStudent = addNewStudent;
    $scope.showStudent = showStudent;
    $scope.showForm = showForm;
    $scope.hideForm = hideForm;
    $scope.seatsFilled = seatsFilled;
    
    // This function is called when the Route Filter is changed and deletes the value
    // if All Routes are selected. If $scope.Route is not deleted, students with
    // a Route attribute value of null will not be included in the filter results.
    function deleteRouteFilter() {
      if ($scope.Route === "") {
        delete $scope.Route;
      }
    };

    // Populate $scope.students for the view.
    function loadStudents () {
      $scope.students = StudentsModel.getStudents(); // Populate array of all students.
    };

    // Show the student's details when their "Details" button is clicked.
    function showStudent(studentId) {
      $scope.detailStudent = StudentsModel.findStudent(studentId);
      $scope.showDetails = true;
    };

    // Add a student with attribute values from the NewStudent object.
    // *** Need to add some validations ***.
    function addNewStudent() {
      StudentsModel.addStudent($scope.NewStudent);
      loadStudents();
      $scope.NewStudent = {};
    };
    
    // Show the Add Student form.
    function showForm() {
      $scope.formDisplay = true;
    };

    // Hide the Add Student form.
    function hideForm() {
      $scope.formDisplay = false;
    };

    // Delete a student when their "Delete" button is clicked.
    //  *** Need to add confirmation ***.
    function removeStudent(studentId) {
      StudentsModel.deleteStudent(studentId);
      loadStudents();
    };

    // Show the edit form with the selected student's info populated
    // when their "Edit" button is clicked.
    function editStudent(studentId) {
      $scope.selectedStudent = StudentsModel.findStudent(studentId);
      
      // Set extra attributes to be used in the updateStudent function 
      // to determine if they were edited or not.
      var student = $scope.selectedStudent;
      student.original_address = student.street_address;
      student.original_city = student.city;
      student.original_postal_code = student.postal_code;
      
      $scope.showEdit = true; // Show the edit form.
    };
      
    // Update the student with the values from the edit student form.
    function updateStudent() {
      var student = $scope.selectedStudent;
      StudentsModel.updateStudent(student);
      loadStudents();
      if (anyChanges(student)) { // Detect any changes to student's address
        geocodeStudent(student); // If there are changes, geocode the student
      }
      $scope.showEdit = false;
    };
    
    // Returns true if either address, city, or postal code has been changed.
    // If any of these are changed, the students lat/lng need to be updated.
    function anyChanges(student) {
      var addressChanged = student.original_address !== student.street_address;
      var cityChanged = student.original_city !== student.city;
      var postalCodeChanged = student.original_postal_code !== student.postal_code;
      return addressChanged || cityChanged || postalCodeChanged; 
    };

    // Geocodes the student based on their updated address info
    // Changes their marker position and infoWindow content to 
    // match the changes.
    function geocodeStudent(student) {
      var address = composeAddress(student);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( {'address':address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          var marker = StudentMarkers.findMarker(student.id);
          if (marker) {
            marker.windowContent += "Address Changed To: " + student.street_address;
            marker.position = results[0].geometry.location;
            marker.setMap(null);
            marker.setMap($scope.shared.map);
          }
          student.updatedLocation = results[0].geometry.location;
        } else {
          alert("Student marker update wasn't successful for the following reason: " + status);
        }
      });
    };

    // Returns the address to be used for the geocodeStudent function.
    function composeAddress(student) {
      if (student.postal_code === null) {
        student.postal_code = " ";
      }
      var address = student.street_address + "," + student.city + "," + "BC" + " " + student.postal_code;
      return address;
    };

    // Calculates the number of seats occupied by the students selected using the 
    // filters. This will be commonly used when filtering by bus route number.
    // When a route filter is applied, the user can click the button to see
    // how many seats are filled by the group.
    // Each school bus bench seat is composed of 3 seats and K-7 take up 1 seat while 8-12
    // take up 1.5 seats.
    function seatsFilled(results) {
      var seatCount = 0;
      angular.forEach(results, function(student) {
        switch(student.grade) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            seatCount += 1;
            break;
          default:
            seatCount += 1.5;
        }
      });
      $scope.seatsAssigned = seatCount;
    };
  }])
;
