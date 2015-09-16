angular.module('bus_routes.students', [])
  
  .controller('StudentCrudCtrl', ["$scope", "$location", "$anchorScroll", "Shared", "StudentsModel", "StudentMarkers", function($scope, $location, $anchorScroll, Shared, StudentsModel, StudentMarkers) {
    
    $scope.shared = Shared;
    $scope.formDisplay = false;
    $scope.showDetails = false;
    $scope.includeSiblings = false;
    $scope.firstOrderSelection = "last_name";
    loadStudents();
    $location.hash(null); // Necessary to prevent scrolling down on page load.
    
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
    
    // Scrolls to the top of the page when "Top" button is clicked.
    function gotoTop() {
      $anchorScroll('add-new-student-button');
    };
    
    // Scrolls to the map when the "Map" button is clicked.
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
      var content = window.document.getElementById("details-list"); // Get the student details
      var detailsWindow = window.open("", "", "width=300, height=600"); // Open a new window.
      // Without this timeout the detailStudent data doesn't show the first time a details button is clicked.
      // Need to find an alternate solution as this is hacky.
      setTimeout(function() { 
        detailsWindow.document.write(content.innerHTML); // Write the student details into the new window
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
    
    // Add siblings if data is provided beside the add new student form.
    function addNewSiblings() {
      if ($scope.sibling1) { // If the object isn't null.
        var firstSibling = angular.copy($scope.NewStudent); // Make a copy of the NewStudent.
        firstSibling.first_name = $scope.sibling1.first_name; // Change the name, school, and grade to reflect the user entered values.
        firstSibling.school = $scope.sibling1.school;
        firstSibling.grade = $scope.sibling1.grade;
        StudentsModel.addStudent(firstSibling); // Save the sibling.
        $scope.sibling1 = null; // Set the object to null so it's ready for the next new student.
      }
      // Repeat what was done for the first sibling.
      // *** There must be a way to do this with a loop in combination with an ng-repeat in the view.
      if ($scope.sibling2) {
        var secondSibling = angular.copy($scope.NewStudent);
        secondSibling.first_name = $scope.sibling2.first_name;
        secondSibling.school = $scope.sibling2.school;
        secondSibling.grade = $scope.sibling2.grade;
        StudentsModel.addStudent(secondSibling);
        $scope.sibling2 = null;
      }
      if ($scope.sibling3) {
        var thirdSibling = angular.copy($scope.NewStudent);
        thirdSibling.first_name = $scope.sibling3.first_name;
        thirdSibling.school = $scope.sibling3.school;
        thirdSibling.grade = $scope.sibling3.grade;
        StudentsModel.addStudent(thirdSibling);
        $scope.sibling3 = null;
      }
      if ($scope.sibling4) {
        var fourthSibling = angular.copy($scope.NewStudent);
        fourthSibling.first_name = $scope.sibling4.first_name;
        fourthSibling.school = $scope.sibling4.school;
        fourthSibling.grade = $scope.sibling4.grade;
        StudentsModel.addStudent(fourthSibling);
        $scope.sibling4 = null;
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
      $scope.showEdit = false;
      $scope.includeSiblings = false;
      gotoTop();
    };
    
    // Update siblings when a student's information is changed.
    function updateSiblings(student) {
      siblingsArray = StudentsModel.findSiblings(student.last_name, student.original_address); // This populates an array with a student's siblings based on last name and address.
      angular.forEach(siblingsArray, function(siblingId) { // Iterate through the array of sibling Id's.
        var sibling = StudentsModel.findStudent(siblingId);
        sibling.phone = student.phone; // Set all the common attributes to the edited student's values.
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
        StudentsModel.updateStudent(sibling); // Save the changes to the sibling.
      }); 
    };

    function updateMarkerPosition(studentId) {
      var marker = StudentMarkers.getMarker(studentId);
      // Need this to give the update method in StudentsModel time to get the new lat and lng from the geocoding process that happens on the back end.
      // *** Should be able to handle this with a promise instead of this hacky timeout.
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
