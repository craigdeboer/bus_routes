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
  });
  $scope.testCase = [];
  function initialize() {
    var mapOptions = {
      center: { lat: 49.1387, lng: -122.8218 },
      zoom: 13
    };
    $scope.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(49.170385, -122.796939),
      map: $scope.map,
      label: 'A',
      icon: '/assets/blue_MarkerA.png',
      animation: google.maps.Animation.BOUNCE,
      title: "Surrey High"
    });
  };
  google.maps.event.addDomListener(window, 'load', initialize);

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
});











