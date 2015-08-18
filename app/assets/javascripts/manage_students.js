// Define the angular module to be used in the application.
// The module takes two arguments: the name of the module and 
// an array of dependencies. The ng-app directive must reference the 
// name you choose for your module here.
var busRoutesApp = angular.module('busRoutesApp', ["ngResource"]);

// This factory defines the connection to the back end database and is
// referenced in the controller using the name which is the first
// argument.
busRoutesApp.factory('Student', ["$resource", function($resource) {
  return $resource("/api/students/:id", {id: "@id"}, {update: {method: "PUT"}});
}]);

// This section defines a controller that belongs to the busRoutesApp
// module. It takes two arguments: a name and either 
// an array of dependencies with the last element being the function or
// it can just take a function. Because of the way Rails minifies JS
// files in production, we need to use the array method of specifying
// dependencies.
// The name is referenced in the view to assign control of that element
// and its children to this specific controller.
busRoutesApp.controller('StudentsListCtrl', ["$scope", "Student", function ($scope, Student) {
  
  // Define scoped variables and collections.  
  $scope.formDisplay = false;
  $scope.students = Student.query(); 
  
  // Define scoped functions.
  $scope.addNewStudent = addNewStudent;
  $scope.removeStudent = removeStudent;
  $scope.showForm = showForm;
  $scope.hideForm = hideForm;
  
  //  Define controller functions. 
  function addNewStudent() {
    student = Student.save($scope.NewStudent);
    $scope.students.push(student);
    $scope.NewStudent = {};
  };
  function removeStudent(index) {
    student = $scope.students[index];
    student.$remove();
    $scope.students.splice(index, 1);
  };
  function showForm() {
    $scope.formDisplay = true;
  };
  function hideForm() {
    $scope.formDisplay = false;
  };
}]);

busRoutesApp.controller('MapCtrl', ["$scope", "Student", function ($scope, Student) {
// If I just perform the Student.query() and then execute 
// the setMarkers function, it fails because I'm trying to access
// the $scope.students before the query is completed.
// If I provide a function within the query, and call the
// setMarkers function within that callback function, I ensure the
// query is complete before I try to access the data.  
  // Define scoped variables and collections.
  var students = Student.query(function() {
    $scope.students = students;
    setMarkers();
  });
  $scope.lastLatLng = null;
  $scope.origin = "Start";
  $scope.destination = "Destination";

  // Define local variables.
  var directionsDisplay1;
  var directionsDisplay2;
  var directionsService = new google.maps.DirectionsService();
  var markerIdCounter = 0;
  var markers = {};

  // Define scoped functions.
  $scope.getOriginLatLng = getOriginLatLng;
  $scope.getDestinationLatLng = getDestinationLatLng;
  $scope.calcRoute = calcRoute;
  
  function initialize() {
    // Initialize the required directions renderers.
    directionsDisplay1 = new google.maps.DirectionsRenderer({draggable: true});
    directionsDisplay2 = new google.maps.DirectionsRenderer({draggable: true});
    // Set map options.
    var mapOptions = {
      center: { lat: 49.1387, lng: -122.8218 },
      zoom: 13
    };
    // Define the map.
    $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    // Add an event listener so we know when a user clicks on the map.
    // This click event will allow us to have access to the LatLng that 
    // was clicked.
    $scope.map.addListener('click', function(event) {
      $scope.lastLatLng = event.latLng
      alert(event.location);
      insertMarker(event.latLng);
    });
    // Set the marker for the schools.
    // *Change this to iterate through an array of all
    // six schools to put them all on the map.
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(49.170385, -122.796939),
      map: $scope.map,
      label: 'A',
      icon: '/assets/blue_MarkerA.png',
      title: "Surrey High"
    });
    // Set up which map the routes should be displayed on.
    directionsDisplay1.setMap($scope.map);
    directionsDisplay2.setMap($scope.map);
    // For now, calcRoutes is called here but it should be user
    // initiated once that functionality is implemented.
  }; // End of initialize function.
  // Wait for the window to load and then run the initialize function.
  google.maps.event.addDomListener(window, 'load', initialize);
  
  function uniqueId() {
    return ++markerIdCounter;
  };
  function getOriginLatLng() {
    $scope.origin = $scope.lastLatLng;
  };
  function getDestinationLatLng() {
    $scope.destination = $scope.lastLatLng;
  };
  function insertMarker(latLng) {
    id = uniqueId(); // retrieve a unique id
    marker = new google.maps.Marker({
      id: id,
      draggable: true,
      position: latLng,
      map: $scope.map,
      title: "Way Point"
    });
    markers[id] = marker; // add this marker to the markers object with the id as the key
  };
  function setMarkers() {
    angular.forEach($scope.students, function(student) {
     studentLatLng = new google.maps.LatLng(student.latitude, student.longitude);
     marker = new google.maps.Marker({
       position: studentLatLng,
       draggable: true,
       map: $scope.map,
       title: student.first_name + " " + student.last_name
     });
    });
  };   
  function calcRoute() {
    console.log($scope.origin);
    var start = $scope.origin;
    var end = $scope.destination;
    var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay1.setDirections(result);
      }
    });
  };
}]);











