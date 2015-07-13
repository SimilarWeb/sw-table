'use strict';
angular.module('sw.table', [])
    .constant('tableConfig', {
        pageSize: 5,
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
                this.width = config.width;
            },

            onSorted: function(sortedCell, tableColumns, onUpdateData) {
                if (!sortedCell.sortable) {
                    return;
                }

                angular.forEach(tableColumns, function(cellObj) {
                    cellObj.isSorted = false;
                });
                sortedCell.isSorted = true;
                sortedCell.sortDirection = sortedCell.sortDirection == 'ASC' ? 'DESC' : 'ASC';
                onUpdateData({field: sortedCell.field, sortDirection: sortedCell.sortDirection});
            },

            onLoadMoreData: function(pageSize, onUpdateData) {
                onUpdateData({pageSize: pageSize});
            }
        };
    })
    .directive('swTable', function (tableService, tableConfig) {
        return {
            restrict: 'E',
            scope: {
                tableData: '=',
                tableColumns: '=',
                updateDataCallback: '&'
            },
            templateUrl: 'src/table.html',
            replace: true,
            link: function postLink(scope, elem, attr) {
                // init
                scope.updateDataCallback = scope.updateDataCallback(); //unwrap the function for easier syntax and allow for nesting in other directives and services
                // draw the UI under "elem"
                // todo add default params to columns here so it doesn't need to be in every controller

                // UI -> Model which means we register on events and change the *scope* variables
                // as a result of events
                scope.onSorted = function(sortedCell) {
                    tableService.onSorted(sortedCell, scope.tableColumns, scope.updateDataCallback);
                };
                scope.onLoadMoreData = function() {
                    tableService.onLoadMoreData(tableConfig.pageSize, scope.updateDataCallback);
                };
                scope.onRowToggle = function(row){
                    row.toggle = !row.toggle;
                };

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
    "<div class=\"swTable\">\n" +
    "    <div class=\"swTable-row swTable-headerRow\">\n" +
    "        <div class=\"swTable-headerCell\" style=\"width: 61px;\"></div>\n" +
    "        <div class=\"swTable-headerCell\" ng-repeat=\"cell in tableColumns\" ng-click=\"onSorted(cell)\" ng-class=\"{'is-sorted': cell.isSorted, 'sortDirection--asc': cell.sortDirection == 'ASC', 'sortDirection--desc': cell.sortDirection == 'DESC'}\" ng-include=\"cell.headerCellTemplate\" ng-style=\"{'width': cell.width + 'px'}\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"swTable-rowWrapper\" ng-class=\"{'swTable-rowWrapper--expanded': row.toggle, 'swTable-rowWrapper--collapsed': !row.toggle}\" ng-repeat=\"row in tableData\">\n" +
    "        <div class=\"swTable-row\">\n" +
    "            <div class=\"swTable-cell swTable-rowInfo\">\n" +
    "                <span class=\"swTable-rowNumber\">{{$index + 1}}</span>\n" +
    "                <span class=\"swTable-rowToggle\" ng-if=\"row.Children\" ng-click=\"onRowToggle(row)\"></span>\n" +
    "            </div>\n" +
    "            <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\" ng-class=\"{'is-sorted': cell.isSorted}\" ng-include=\"cell.cellTemplate\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"swTable-row swTable-ChildRow\" ng-repeat=\"row in row.Children\">\n" +
    "            <div class=\"swTable-cell\"></div>\n" +
    "            <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\" ng-class=\"{'is-sorted': cell.isSorted}\" ng-include=\"cell.cellTemplate\" ng-style=\"{'width': cell.width}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <button type=\"button\" ng-click=\"onLoadMoreData()\">Load More Data</button>\n" +
    "</div>"
  );


  $templateCache.put('templates/app-name.html',
    "<div>{{ row[cell.field] }}</div>\n" +
    "<div class=\"tooltip\">\n" +
    "    <img width=\"36\" height=\"36\" src=\"{{ row.tooltip.Icon }}\" alt=\"\"/>\n" +
    "    <div>Author: {{ row.Author }}</div>\n" +
    "</div>"
  );


  $templateCache.put('templates/days-since-install.html',
    "<span>{{ row[cell.field] }}</span>"
  );


  $templateCache.put('templates/default-cell.html',
    "<div>\r" +
    "\n" +
    "    {{ row[cell.field] }} <span ng-if=\"row.Children\">({{row.Children.length}})</span>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/default-header-cell.html',
    "<div sw-titelize=\"{{col.displayName}}\">{{ cell.displayName }}<div class=\"swTable-rowCount\">10,000</div><div class=\"swTable-sortDirection\"></div></div>"
  );


  $templateCache.put('templates/row-number.html',
    "{{$index + 1}}"
  );


  $templateCache.put('templates/row-selection.html',
    "<div class=\"sw-header-title\" sw-titelize=\"keywords.analysis.table.checkbox\">\r" +
    "\n" +
    "    <input type=\"checkbox\" tabindex=\"-1\" ng-checked=\"\" />\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/traffic-share.html',
    "<div class=\"sw-progress\">\n" +
    "    <span class=\"value\">{{ row[cell.field] | percentage:2 }}%</span>\n" +
    "    <div class=\"bar\" style=\"background: #CBD7E3; width: 250px; height: 14px; border: 1px solid #B8C4D2; display: inline-block;\">\n" +
    "        <div style=\"background: #4A86C5; width: {{ row[cell.field] | percentage:2 }}%; height: 100%; border-right: 1px solid #B8C4D2;\"></div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);

//# sourceMappingURL=sw-table.js.map