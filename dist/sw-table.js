'use strict';
angular.module('sw.table', [])
    .constant('tableConfig', {
        displayFormat: 'MMM, YYYY',
        customFormat: 'YYYY.MM'
    })
    .controller('tableCtrl', function ($scope) {
        $scope.tableRows = $scope.tableData;
    })
    .directive('swTable', function () {
        return {
            restrict: 'E',
            scope: {
                tableData: '=',
                tableColumns: '='
            },
            templateUrl: 'src/table.html',
            replace: true,
            controller: 'tableCtrl'
        }
    })
;

angular.module('sw.table').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/table.html',
    "<div class=\"swTable\">\r" +
    "\n" +
    "    <div class=\"swTable-row\" ng-repeat=\"row in tableData\">\r" +
    "\n" +
    "        <div class=\"swTable-cell\" ng-repeat=\"cell in Tablecolumns\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/days-since-install.html',
    "<span>Day 1.</span>"
  );


  $templateCache.put('templates/default-header-cell.html',
    "<div class=\"swTable-headerCell\">{{col.displayName}}</div>"
  );


  $templateCache.put('templates/traffic-share.html',
    "<div class=\"sw-progress\">\r" +
    "\n" +
    "    <div class=\"value\">10%</div>\r" +
    "\n" +
    "    <div class=\"bar\">\r" +
    "\n" +
    "        <div style=\"background: red; width: 50%;\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);

//# sourceMappingURL=sw-table.js.map