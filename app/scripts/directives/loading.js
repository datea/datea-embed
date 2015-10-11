'use strict';

angular.module('dateaEmbedApp')
.directive('daLoading', function() {
  return {
      restrict    :'A'
    , scope: { daLoading  : '=' }
    , link: function (scope, element) {

      scope.$watch('daLoading', function (){
        if (scope.daLoading) {
          element.addClass('datea-loading');
        }else {
          element.removeClass('datea-loading');
        }
      });
      element.append('<div class="datea-loading-icon"><i class="icon-loading fa-spin"></i></div>');
    }
  };
} );
