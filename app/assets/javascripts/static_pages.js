// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
var busRoutesApp = angular.module('busRoutesApp', ["ngResource"]);

//busRoutesApp.factory("Student", function($resource) {
//  return $resource("api/students/:id", {id: "@id"}, {'update', {method: 'PUT'}});
//});
busRoutesApp.controller('StudentsListCtrl', function ($scope, $resource) {
  Student = $resource("/api/students/:id", {id: "@id"}, {update: {method: "PUT"}});
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
});
