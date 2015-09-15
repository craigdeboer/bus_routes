angular.module('bus_routes.students', [])
  
  .controller('StudentCrudCtrl', ["$scope", "$location", "$anchorScroll", "Shared", "StudentsModel", "StudentMarkers", function($scope, $location, $anchorScroll, Shared, StudentsModel, StudentMarkers) {
    
    $scope.shared = Shared;
    $scope.formDisplay = false;
    $scope.showDetails = false;
    $scope.includeSiblings = false;
    $scope.firstOrderSelection = "last_name";
    loadStudents();
    $location.hash(null);
    
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
    $scope.gotoTop = gotoTop;
    $scope.gotoMap = gotoMap;
    
    function gotoTop() {
      $anchorScroll('add-new-student-button');
    };
    
    function gotoMap() {
      $anchorScroll('map-canvas');
    };

    
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
      var content = window.document.getElementById("details-list"); // get the student details
      var detailsWindow = window.open("", "", "width=300, height=600");
      setTimeout(function() {
        detailsWindow.document.write(content.innerHTML); // write the student details into the new window
      }, 250);
    };

    // Add a student with attribute values from the NewStudent object.
    // *** Need to add some validations ***.
    function addNewStudent() {
      StudentsModel.addStudent($scope.NewStudent);
      addNewSiblings();
      loadStudents();
      $scope.NewStudent = {};
      gotoTop();
    };
    
    function addNewSiblings() {
      if ($scope.sibling1) {
        var firstSibling = angular.copy($scope.NewStudent);
        firstSibling.first_name = $scope.sibling1.first_name;
        firstSibling.school = $scope.sibling1.school;
        firstSibling.grade = $scope.sibling1.grade;
        StudentsModel.addStudent(firstSibling);
        $scope.sibling1 = null;
      }
        
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
//      student.original_city = student.city;
//      student.original_postal_code = student.postal_code;
      
      $scope.showEdit = true; // Show the edit form.
      gotoTop();
    };
      
    // Update the student with the values from the edit student form.
    function updateStudent() {
      var student = $scope.selectedStudent;
      if ($scope.includeSiblings === true) {
        updateSiblings(student);
      }
      var updatedStudent = StudentsModel.updateStudent(student);
      updateMarkerPosition(student.id);
      loadStudents();
//      if (anyChanges(student)) { // Detect any changes to student's address
//        geocodeStudent(student); // If there are changes, geocode the student
//      }
      $scope.showEdit = false;
      $scope.includeSiblings = false;
      gotoTop();
    };
    
    function updateSiblings(student) {
      siblingsArray = StudentsModel.findSiblings(student.last_name, student.original_address);
      angular.forEach(siblingsArray, function(siblingId) {
        var sibling = StudentsModel.findStudent(siblingId);
        sibling.phone = student.phone;
        sibling.email = student.email;
        sibling.street_address = student.street_address;
        sibling.city = student.city;
        sibling.postal_code = student.postal_code;
        sibling.additional_phones = student.additional_phones;
        sibling.additional_email = student.additional_email;
        sibling.parent_names = student.parent_names;
        sibling.bus_route = student.bus_route;
        sibling.return_trip = student.return_trip;
        sibling.stop = student.stop;
        sibling.mon_thurs = student.mon_thurs;
        sibling.friday = student.friday;
        StudentsModel.updateStudent(sibling);
      }); 
    };

    
    // Returns true if either address, city, or postal code has been changed.
    // If any of these are changed, the students lat/lng need to be updated.
//    function anyChanges(student) {
//      var addressChanged = student.original_address !== student.street_address;
//      var cityChanged = student.original_city !== student.city;
//      var postalCodeChanged = student.original_postal_code !== student.postal_code;
//      return addressChanged || cityChanged || postalCodeChanged; 
//    };

    function updateMarkerPosition(studentId) {
      var marker = StudentMarkers.getMarker(studentId);
      setTimeout(function (){
      student = StudentsModel.findStudent(studentId);
      if (marker) {
        var studentLatLng = new google.maps.LatLng(student.latitude, student.longitude);
        marker.position = studentLatLng;
        marker.windowContent += "Address Changed To: " + student.street_address;
        marker.setMap(null);
        marker.setMap($scope.shared.map);
      }
      }, 2000);
    };




    // Geocodes the student based on their updated address info
    // Changes their marker position and infoWindow content to 
    // match the changes.
//    function geocodeStudent(student) {
//      var address = composeAddress(student);
//      var geocoder = new google.maps.Geocoder();
//      geocoder.geocode( {'address':address}, function(results, status) {
//        if (status === google.maps.GeocoderStatus.OK) {
//          var marker = StudentMarkers.findMarker(student.id);
//          if (marker) {
//            marker.windowContent += "Address Changed To: " + student.street_address;
//            marker.position = results[0].geometry.location;
//            marker.setMap(null);
//            marker.setMap($scope.shared.map);
//          }
//          student.updatedLocation = results[0].geometry.location;
//        } else {
//          alert("Student marker update wasn't successful for the following reason: " + status);
//        }
//      });
//    };

    // Returns the address to be used for the geocodeStudent function.
//    function composeAddress(student) {
//      if (student.postal_code === null) {
//        student.postal_code = " ";
//      }
//      var address = student.street_address + "," + student.city + "," + "BC" + " " + student.postal_code;
//      return address;
//    };

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
