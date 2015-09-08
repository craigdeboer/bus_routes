angular.module('bus_routes.students', [
               ])
  
  .controller('StudentCrudCtrl', ["$scope", "Shared", "StudentsModel", "StudentMarkers", function($scope, Shared, StudentsModel, StudentMarkers) {
    function loadStudents () {
      $scope.students = StudentsModel.getStudents(); // Populate array of all students.
    };
    loadStudents();
    $scope.shared = Shared;
    $scope.formDisplay = false;
    $scope.showDetails = false;
    $scope.firstOrderSelecton = "last_name";
    
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

    function showStudent(studentId) {
      $scope.detailStudent = StudentsModel.findStudent(studentId);
      $scope.showDetails = true;
    };


    //  Define controller functions. 
    function addNewStudent() {
      StudentsModel.addStudent($scope.NewStudent);
      loadStudents();
      $scope.NewStudent = {};
    };
    function showForm() {
      $scope.formDisplay = true;
    };
    function hideForm() {
      $scope.formDisplay = false;
    };

    function removeStudent(studentId) {
      StudentsModel.deleteStudent(studentId);
      loadStudents();
    };

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
      

    function updateStudent() {
      var student = $scope.selectedStudent;
      StudentsModel.updateStudent(student);
      loadStudents();
      if (anyChanges(student)) {
        geocodeStudent(student);
      }
      $scope.showEdit = false;
    };
    
    function anyChanges(student) {
      var addressChanged = student.original_address !== student.street_address;
      var cityChanged = student.original_city !== student.city;
      var postalCodeChanged = student.original_postal_code !== student.postal_code;
      return addressChanged || cityChanged || postalCodeChanged; 
    };
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
    function composeAddress(student) {
      if (student.postal_code === null) {
        student.postal_code = " ";
      }
      var address = student.street_address + "," + student.city + "," + "BC" + " " + student.postal_code;
      return address;
    };

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
