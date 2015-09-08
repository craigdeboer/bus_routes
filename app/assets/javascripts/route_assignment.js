// This submodule handles individual student route assignment
// and bulk route assignment.
angular.module('bus_routes.route_assignment', [])

  .controller('RouteAssignmentCtrl', ['$scope', 'Shared', 'StudentsModel', 'StudentMarkers', function($scope, Shared, StudentsModel, StudentMarkers) {

    $scope.shared = Shared;
    $scope.bulkAssignmentRoute = null;

    // Define scoped functions.
    $scope.updateStudentRouteInfo = updateStudentRouteInfo;
    $scope.clearSelected = clearSelected;
    $scope.massAssignRoute = massAssignRoute;
    $scope.removeFromSelections = removeFromSelections;

    // Removes the student and their siblings when their 
    // "Remove" button is clicked.
    function removeFromSelections(topSiblingId, index) {
      var marker = StudentMarkers.getMarker(topSiblingId); // Retrieve their marker.
      var numberOfSiblings = marker.siblings.length + 1; // Find out how many siblings they have.
      $scope.shared.selections.splice(index, numberOfSiblings); // Remove the student and their siblings from the bulk assign list.
    };

    // Clear the list of selected students.
    function clearSelected() {
      $scope.shared.selections = [];
    };

    // Assigns routes to all students in the list.
    function massAssignRoute() {
      angular.forEach($scope.shared.selections, function(student) {
        var route = parseInt($scope.bulkAssignmentRoute); // Get the value of the route as na Int.
        student.bus_route = route; // Set the route value of the student.
        StudentsModel.updateStudent(student); // Save the change.
        // If the student is assigned to a marker, update the color
        // to reflect the new bus_route value.
        if (StudentMarkers.getMarker(student.id)) {
          changeMarkerColor(student.id, route); 
        }
      });
      $scope.shared.selections = []; // Clear the selections.
      $scope.bulkAssignmentRoute = null; // Clear the selected route.
      $scope.shared.beginSelection = false; // Hide the selected list.
    };

    // Updates the individual student's route and the route of
    // any siblings associated with them.
    function updateStudentRouteInfo() {
      var student = $scope.shared.clickedStudent; // The clickedStudent is set when adding listener to the marker.
      var route = parseInt(student.bus_route); // Define the route as an Int.
      var stop = student.stop; // Define stop info.
      var mon_thurs = student.mon_thurs; // Define mon - thurs time.
      var friday = student.friday; // Define friday time.
      student.bus_route = route; // Set the bus_route value of the student.
      StudentsModel.updateStudent(student); // Save the changes.
      var marker = StudentMarkers.getMarker(student.id); // Get the students marker.
      changeSiblingsRoute(marker, route, stop, mon_thurs, friday); // Also update the student's siblings.
      changeMarkerColor(student.id, route); // Change the marker icon color to reflect the new route.
    };

    // Changes the marker color of the student to reflect the new route.
    function changeMarkerColor(studentId, route) {
      var icon = StudentMarkers.setMarkerColor(route);
      var marker = StudentMarkers.getMarker(studentId);
      marker.icon = icon; // Find the icon.
      marker.setMap(null); // Temporarily remove the marker.
      marker.setMap($scope.shared.map); // Reset the marker.
    };

    // Change the route and stop info for the student's siblings.
    function changeSiblingsRoute(marker, route, stop, mon_thurs, friday) {
      if (marker.siblings.length !== 0) { // Check to see if there are siblings.
        // If there are, update their info and save it.
        angular.forEach(marker.siblings, function(siblingId) {
          var sibling = StudentsModel.findStudent(siblingId);
          sibling.bus_route = route;
          sibling.stop = stop;
          sibling.mon_thurs = mon_thurs;
          sibling.friday = friday;
          StudentsModel.updateStudent(sibling); 
        });
      }
    };
  }])
;
