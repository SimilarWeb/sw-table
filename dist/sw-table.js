'use strict';
angular.module('sw.table', [])
    .constant('tableConfig', {
        pageSize: 100,
        sortDirection: 'ASC'
    })
    .service('tableService', function(tableConfig) {
        return {
            /*
             * @param {obj} config
             * @returns {obj} column configuration object
             */
            Column: function(config) {
                this.field = config.field || 'DaysSinceInstall';
                this.displayName = config.displayName || '';
                this.cellTemplate = config.cellTemplate || 'templates/default-cell.html';
                this.headerCellTemplate = config.headerCellTemplate || 'templates/default-header-cell.html';
                this.sortable = config.sortable || false;
                this.sortDirection = config.sortDirection || tableConfig.sortDirection;
                this.isSorted = config.isSorted || false;
            },

            onSorted: function(sortedCell) {
                angular.forEach($scope.tableColumns, function(cellObj) {
                    cellObj.isSorted = false;
                });
                sortedCell.isSorted = true;
                sortedCell.sortDirection = sortedCell.sortDirection == 'ASC' ? 'DESC' : 'ASC';
            }
        };
    })
    .directive('swTable', function (tableService) {
        return {
            restrict: 'E',
            scope: {
                tableData: '=',
                tableColumns: '=',
                onLoadMoreData: '&',
                onSortData: '&'
            },
            templateUrl: 'src/table.html',
            replace: true,
            link: function postLink(scope, elem, attr) {
                // init

                // draw the UI under "elem"
                // todo add default params to columns here so it doesn't need to be in every controller

                // UI -> Model which means we register on events and change the *scope* variables
                // as a result of events
                scope.onSorted = function(sortedCell) {
                    tableService.onSorted(sortedCell);
                };
                // todo check if there are more results than already loaded before sending request

                // Model -> UI which is where we assign watches to scope variables and change
                // the UI when they change
                // todo load more/ pagination

                // cleanup where we unbind from global events upon scope destroy and/or perhaps
                // send events down the scope tree or up the scope tree etc
            }
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
    "        <div class=\"swTable-headerCell\" ng-repeat=\"cell in tableColumns\" ng-click=\"onSorted(cell)\" ng-class=\"{'is-sorted': cell.isSorted}\">\r" +
    "\n" +
    "            <div ng-include=\"cell.headerCellTemplate\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"swTable-row\" ng-repeat=\"row in tableData\">\r" +
    "\n" +
    "        <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\" ng-class=\"{'is-sorted': cell.isSorted}\">\r" +
    "\n" +
    "            <div ng-include=\"cell.cellTemplate\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/app-name.html',
    "<div>{{ row[cell.field] }}</div>\r" +
    "\n" +
    "<div class=\"tooltip\">\r" +
    "\n" +
    "    <img src=\"{{ row.tooltip.Icon }}\" alt=\"\"/>\r" +
    "\n" +
    "    <div>Author: {{ row.Author }}</div>\r" +
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