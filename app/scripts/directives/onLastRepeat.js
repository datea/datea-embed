'use strict';

angular.module('dateaEmbedApp')
.directive('daOnLastRepeat', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$eval(attr.daOnLastRepeat);
        });
      }
    }
  };
} ] );
