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
    "    <div class=\"swTable-row swTable-headerRow\">\r" +
    "\n" +
    "        <div class=\"swTable-headerCell\" ng-repeat=\"cell in tableColumns\">\r" +
    "\n" +
    "            <div ng-include=\"cell.headerCellTemplate\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"swTable-row\" ng-repeat=\"row in tableData\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\">\r" +
    "\n" +
    "            <div ng-include=\"cell.cellTemplate\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/days-since-install.html',
    "<span>{{ row[cell.field] }}</span>"
  );


  $templateCache.put('templates/default-header-cell.html',
    "<div class=\"swTable-headerCell\">{{ cell.displayName }}</div>"
  );


  $templateCache.put('templates/traffic-share.html',
    "<div class=\"sw-progress\">\r" +
    "\n" +
    "    <div class=\"value\">{{ row[cell.field] }}</div>\r" +
    "\n" +
    "    <div class=\"bar\" style=\"background: grey; width: 50px; height: 10px;\">\r" +
    "\n" +
    "        <div style=\"background: red; width: {{ row[cell.field] }}%; height: 10px;\"></div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);

//# sourceMappingURL=sw-table.js.map