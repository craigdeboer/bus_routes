// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
var busRoutesApp = angular.module('busRoutesApp', ["ngResource"]);

//busRoutesApp.factory("Student", function($resource) {
//  return $resource("api/students/:id", {id: "@id"}, {'update', {method: 'PUT'}});
//});
busRoutesApp.factory('Student', function($resource) {
  return $resource("/api/students/:id", {id: "@id"}, {update: {method: "PUT"}});
});

busRoutesApp.controller('StudentsListCtrl', function ($scope, Student) {
  $scope.formDisplay = false;
  $scope.students = Student.query(); 
  $scope.addNewStudent = function () {
    student = Student.save($scope.NewStudent);
    $scope.students.push(student);
    $scope.NewStudent = {};
  };
  $scope.removeStudent = function (index) {
    student = $scope.students[index];
    student.$remove();
    $scope.students.splice(index, 1);
  };
  $scope.showForm = function () {
    $scope.formDisplay = true;
  };
  $scope.hideForm = function () {
    $scope.formDisplay = false;
  };
});

busRoutesApp.controller('MapCtrl', function ($scope, Student) {
// If I just perform the Student.query() and then execute 
// the setMarkers function, it fails because I'm trying to access
// the $scope.students before the query is completed.
// If I provide a function within the query, and call the
// setMarkers function within that callback function, I ensure the
// query is complete before I try to access the data.  
  var students = Student.query(function() {
    $scope.students = students;
    setMarkers();
    calcRoute();
  });
  $scope.testCase = [];
  $scope.lastLatLng = "";
  $scope.origin = "Start";
  $scope.destination = "Destination";

  var directionsDisplay1;
  var directionsDisplay2;
  var directionsService = new google.maps.DirectionsService();

  function initialize() {
    directionsDisplay1 = new google.maps.DirectionsRenderer({draggable: true});
    directionsDisplay2 = new google.maps.DirectionsRenderer({draggable: true});
    var mapOptions = {
      center: { lat: 49.1387, lng: -122.8218 },
      zoom: 13
    };
    $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    $scope.map.addListener('click', function(event) {
      $scope.lastLatLng = event.latLng
      alert(event.latLng);
      insertMarker(event.latLng);
    });
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(49.170385, -122.796939),
      map: $scope.map,
      label: 'A',
      icon: '/assets/blue_MarkerA.png',
      title: "Surrey High"
    });
    directionsDisplay1.setMap($scope.map);
    directionsDisplay2.setMap($scope.map);
  };
  google.maps.event.addDomListener(window, 'load', initialize);
  $scope.getLatLng = function() {
    $scope.origin = $scope.lastLatLng;
  };
  

  /*$("#start").focusin(function() {
    $scope.map.addListener('click', function(event) {
      alert(event.latLng);
      $("#start").val(event.latLng); 
    });
  });
  $("#finish").focus(function() {
    $scope.map.addListener('click', function(event) {
      alert(event.latLng);
      $("#finish").val(event.latLng); 
    });
  });*/
  insertMarker = function(latLng) {
    marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map,
      title: "Way Point"
    });
  };
  setMarkers = function () {
    angular.forEach($scope.students, function(student) {
     $scope.testCase.push(student.latitude);
     studentLatLng = new google.maps.LatLng(student.latitude, student.longitude);
     marker = new google.maps.Marker({
       position: studentLatLng,
       map: $scope.map,
       title: student.first_name + student.last_name
     });
    });
  };   
  calcRoute = function () {
    var start = new google.maps.LatLng(49.17705, -122.8588);
    var end = new google.maps.LatLng(49.1628, -122.7985);
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
});











