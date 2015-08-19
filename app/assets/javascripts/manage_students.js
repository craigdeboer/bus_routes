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
  });
  $scope.lastLatLng = null;
  $scope.origin = "Start";
  $scope.destination = "Destination";
  $scope.selectedRoute = "";
  $scope.routes = {
    "101": {
      "waypoints": {
      },
      "capacity": 40
    }
  };

  // Define local variables.
  var directionsDisplay1;
  var directionsDisplay2;
  var directionsService = new google.maps.DirectionsService();
  var markerIdCounter = 0; // used to assign unique id to each marker added by user
  var routeMarkers = {}; // used to track the markers created by the user
  var studentMarkers = {};
  var existingStudentMarkers = [];

  // Define scoped functions.
  $scope.calcRoute = calcRoute;
  $scope.setMarkers = setMarkers;
  $scope.subRouteOne = {
    1: {
       lat: null,
       lng: null
    },
    2: {
       lat: null,
       lng: null
    },
    3: {
       lat: null,
       lng: null
    },
    4: {
       lat: null,
       lng: null
    },
    5: {
       lat: null,
       lng: null
    },
    6: {
       lat: null,
       lng: null
    }
  }; // used to hold first 6 waypoints for rendering 
  $scope.subRouteTwo = {
    6: {
       lat: null,
       lng: null
    },
    7: {
       lat: null,
       lng: null
    },
    8: {
       lat: null,
       lng: null
    },
    9: {
       lat: null,
       lng: null
    },
    10: {
       lat: null,
       lng: null
    },
    11: {
       lat: null,
       lng: null
    }
  }; // used to hold next 6 waypoints if necessary 
  $scope.subRouteThree = {
    11: {
       lat: null,
       lng: null
    },
    12: {
       lat: null,
       lng: null
    },
    i: {
       lat: null,
       lng: null
    },
    4: {
       lat: null,
       lng: null
    },
    5: {
       lat: null,
       lng: null
    },
    6: {
       lat: null,
       lng: null
    }
  }; // used to hold the next 6 waypoints if necessary 
  $scope.subRouteFour = {}; // used to hold the last 6 waypoints if necessary
  
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
  function insertMarker(latLng) {
    var id = uniqueId(); // retrieve a unique id
    marker = new google.maps.Marker({
      id: id,
      draggable: true,
      position: latLng,
      map: $scope.map,
      title: "Stop"
    });
    routeMarkers[id] = marker; // add this marker to the markers object with the id as the key
  };
  function setMarkers() {
    var id;
    var icon;
    var label = "1";
    angular.forEach($scope.students, function(student) {
     var existingAddress = checkForExistingMarker(student.latitude, student.longitude);
     console.log(existingAddress);
     if (existingAddress) {
       marker = studentMarkers[existingAddress];
       console.log("in the existing address" + marker.label);
       markerNumber = parseInt(marker.label) + 1;
       marker.label = markerNumber.toString();
     } else {
       id = student.id;
       icon = setMarkerColor(student.school); 
       studentLatLng = new google.maps.LatLng(student.latitude, student.longitude);
       marker = new google.maps.Marker({
         id: id,
         position: studentLatLng,
         icon: icon,
         label: label,
         draggable: true,
         map: $scope.map,
         title: student.first_name + " " + student.last_name
       });
       studentMarkers[id] = marker;
       existingStudentMarkers.push([student.latitude, student.longitude, student.id]);
     }
    });
  };   
  function checkForExistingMarker(lat, lng) {
    if (existingStudentMarkers.length !== 0) {
      for (i = 0; i < existingStudentMarkers.length; i++) {
        if (lat === existingStudentMarkers[i][0] && lng === existingStudentMarkers[i][1]) {
          return existingStudentMarkers[i][2];
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };
  function setMarkerColor(school) {
    switch (school) {
      case "Surrey High":
        icon = '/assets/brightGreen.png';
        break;
      case "LCS":
        icon = '/assets/lightBlue.png';
        break;
      default:
        icon = '/assets/red.png';
    }
    return icon;
  };
  $scope.firstStep = function() {
    // alert(Object.keys(markers).length);
    defineSubRoutes();
    console.log($scope.subRouteOne);
    calcRoute();
  };
  function defineSubRoutes() {
    count = 0;
    route = $scope.selectedRoute;
    angular.forEach(markers, function(marker) {
      var markerLat = markerLatitude(marker);
      var markerLng = markerLongitude(marker);
      // $scope.routes[route].waypoints.push(markerLatLng);
      count++;
      $scope.subRouteOne[count];
      console.log($scope.subRouteOne);
      // The first 5 waypoints go into the subRouteOne array
      if(count < 6) { 
        $scope.subRouteOne[count].lat = markerLat;
        $scope.subRouteOne[count].lng = markerLng;
      // The sixth waypoint is the last waypoint in the subRouteOne array and the first waypoint in the subRouteTwo array. It essentially connects the two subRoutes together.
      } else if(count == 6) {           
        $scope.subRouteOne[count].lat = markerLat;
        $scope.subRouteOne[count].lng = markerLng;
        $scope.subRouteTwo[count].lat = markerLat;
        $scope.subRouteTwo[count].lng = markerLng;
      // Waypoints 7-10 go into subRouteTwo  
      } else if(count > 6 && count < 11) {
        $scope.subRouteTwo[count].lat = markerLat;
        $scope.subRouteTwo[count].lng = markerLng;
      // Eleventh waypoint is a connector waypoint for subRoutes Two and Three  
      } else if(count === 11) {
        $scope.subRouteTwo[count].lat = markerLat;
        $scope.subRouteTwo[count].lng = markerLng;
        $scope.subRouteThree[count].lat = markerLat;
        $scope.subRouteThree[count].lng = markerLng;
      }
    });
  };
  function markerLatitude(marker) {
    var lat = marker.getPosition().lat();
    return lat;
  };
  function markerLongitude(marker) {
    var lng = marker.getPosition().lng();
    return lng;
  };
  function calcRoute() {
    var start = new google.maps.LatLng($scope.subRouteOne.one.lat, $scope.subRouteOne.one.lng);
    var end = new google.maps.LatLng($scope.subRouteOne.lat, $scope.subRouteOne.lng);
    console.log(start + end);
    // var waypoints = findWaypoints($scope.subRouteOne);
    var request = {
      origin:start,
      destination:end,
      // waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay1.setDirections(result);
      }
    });
    deleteRouteMarkers();
  };
  function findWaypoints(waypointsArray) {
    var waypoints = [];
    for (var i = 1; i < waypointsArray.length - 1; i++) {
      waypoints.push(waypointsArray[i]);
    }
    return waypoints;
  };
  function deleteRouteMarkers() {
    angular.forEach(markers, function(marker) {
      marker.setMap(null);
    });
  };
  $scope.printMap = function() {
    var content = window.document.getElementById("map-canvas"); // get you map details
    var newWindow = window.open(); // open a new window
    newWindow.document.write(content.innerHTML); // write the map into the new window
    newWindow.print(); // print the new window
  };
}]);











