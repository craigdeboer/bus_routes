// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
var busRoutesApp = angular.module('busRoutesApp', []);

busRoutesApp.controller('StudentsListCtrl', function ($scope) {
  $scope.students = [
    {'first_name': 'Craig',
     'last_name': 'Deboer',
     'school': 'Surrey High'}
  ];
  $scope.addNewStudent = function () {
    $scope.students.push($scope.NewStudent);
    $scope.NewStudent = {};
  };
  $scope.removeStudent = function (index) {
    $scope.students.splice(index, 1);
  };
});
