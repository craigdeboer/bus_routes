// This submodule is used by the map submodule to display the school marker icons.
angular.module('bus_routes.models.schools', [])

  .service('SchoolsModel', function() {
    var model = this;
    schools = [
      {"name": "Surrey Chiristian High", "latitude": "49.170385", "longitude": "-122.796939"},
      {"name": "William of Orange", "latitude": "49.112364", "longitude": "-122.738985"},
      {"name": "Credo Christian Elementary", "latitude": "49.096882", "longitude": "-122.6161698"},
      {"name": "Credo Christian High", "latitude": "49.095947", "longitude": "-122.617342"},
      {"name": "Langley Christian Elementary", "latitude": "49.0885572", "longitude": "-122.5894669"},
      {"name": "Langley Christian Middle/High", "latitude": "49.0885595", "longitude": "-122.5951462"},
      {"name": "Surrey Christian Elementary", "latitude": "49.164418", "longitude": "-122.773024"},
      {"name": "Cloverdale Christian", "latitude": "49.110539", "longitude": "-122.726684"},
    ];
    model.getSchools = function() {
      return schools;
    };
  })
;
