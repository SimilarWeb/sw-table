'use strict';
angular.module('sw.table', [])
    .constant('tableConfig', {
        pageSize: 100,
        sortDirection: 'DESC'
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
                this.groupable = config.groupable || false;
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
                tableOptions: '=',
                updateDataCallback: '&'
            },
            templateUrl: 'src/table.html',
            replace: true,
            link: function postLink(scope, elem, attr) {
                // init
                scope.updateDataCallback = scope.updateDataCallback(); //unwrap the function for easier syntax and allow for nesting in other directives and services
                if (scope.tableOptions) {
                    if (scope.tableOptions.showIndex == true) {
                        scope.tableColumns.unshift(new tableService.Column({
                            width: 41,
                            sortable: false,
                            cellTemplate: 'templates/row-info.html',
                            headerCellTemplate: 'templates/default-header-cell.html'
                        }));
                    }
                }
                // draw the UI under "elem"
                // todo add default params to columns here so it doesn't need to be in every controller

                // UI -> Model which means we register on events and change the *scope* variables
                // as a result of events
                scope.onSorted = function(sortedCell) {
                    tableService.onSorted(sortedCell, scope.tableColumns, scope.updateDataCallback);
                };
                if (scope.tableOptions && scope.tableOptions.showLoadMore == true) {
                    scope.onLoadMoreData = function() {
                        tableService.onLoadMoreData(tableConfig.pageSize, scope.updateDataCallback);
                    };
                }
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
    });

angular.module('sw.table').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/table.html',
    "<div>\n" +
    "    <div class=\"swTable\">\n" +
    "        <div class=\"swTable-row swTable-headerRow\">\n" +
    "            <div class=\"swTable-headerCell\"\n" +
    "                 ng-class=\"{'is-sorted': cell.isSorted,\n" +
    "                    'sortDirection--asc': cell.sortDirection == 'ASC',\n" +
    "                    'sortDirection--desc': cell.sortDirection == 'DESC',\n" +
    "                    'swTable-groupCell': cell.groupable}\"\n" +
    "                 ng-repeat=\"cell in tableColumns\"\n" +
    "                 ng-click=\"onSorted(cell)\"\n" +
    "                 ng-include=\"cell.headerCellTemplate\"\n" +
    "                 ng-style=\"{'width': cell.width + 'px'}\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"swTable-rowWrapper\"\n" +
    "             ng-class=\"{'swTable-rowWrapper--expanded': row.toggle, 'swTable-rowWrapper--collapsed': !row.toggle}\"\n" +
    "             ng-repeat=\"row in tableData.Records track by $index\">\n" +
    "            <div class=\"swTable-row\">\n" +
    "                <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\" ng-class=\"{'is-sorted': cell.isSorted, 'swTable-groupCell': cell.groupable}\" ng-include=\"cell.cellTemplate\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"swTable-row swTable-ChildRow\" ng-repeat=\"row in row.Children track by $index\">\n" +
    "                <div class=\"swTable-cell\" ng-repeat=\"cell in tableColumns\" ng-class=\"{'is-sorted': cell.isSorted, 'swTable-groupCell': cell.groupable}\" ng-include=\"cell.cellTemplate\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"swTable-tableFooter\" ng-if=\"tableOptions.showLoadMore\">\n" +
    "        <button type=\"button\" class=\"swTable-loadMore\" ng-click=\"onLoadMoreData()\">Load More</button>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/default-cell.html',
    "<div>{{ row[cell.field] }}</div>"
  );


  $templateCache.put('templates/default-group-cell.html',
    "<div style=\"position: relative;\">\n" +
    "    <div class=\"swTable-rowToggle\" ng-if=\"row.Children\" ng-click=\"onRowToggle(row)\"></div>\n" +
    "    {{ row[cell.field] }} <span ng-if=\"row.Children\">({{row.Children.length}})</span>\n" +
    "</div>"
  );


  $templateCache.put('templates/default-header-cell.html',
    "<div>{{cell.displayName}}<div ng-if=\"cell.sortable\" class=\"swTable-sortDirection\"></div></div>\n" +
    "</div>"
  );


  $templateCache.put('templates/row-info.html',
    "<div class=\"swTable-rowInfo\">\n" +
    "    <span class=\"swTable-rowNumber\">{{$parent.$parent.$index + 1}}</span>\n" +
    "</div>"
  );


  $templateCache.put('templates/row-selection.html',
    "<div class=\"sw-header-title\" sw-titelize=\"keywords.analysis.table.checkbox\">\n" +
    "    <input type=\"checkbox\" tabindex=\"-1\" ng-checked=\"\" />\n" +
    "</div>\n"
  );


  $templateCache.put('templates/site-name.html',
    "<div>\n" +
    "    {{ row[cell.field] }} <span ng-if=\"row.Children\">({{row.Children.length}})</span>\n" +
    "</div>"
  );


  $templateCache.put('templates/website-tooltip-cell.html',
    "<div>\r" +
    "\n" +
    "    <a sw-website-info-tip=\"{{row[cell.field]}}\"\r" +
    "\n" +
    "       ng-href=\"/website/analysis/#/{{row[cell.field]}}/*/999/6m/audience/overview\"\r" +
    "\n" +
    "       target=\"_blank\">\r" +
    "\n" +
    "        <img ng-src=\"{{row.Icon || row.Favicon}}\" class=\"favicon\"/>\r" +
    "\n" +
    "        {{row[cell.field]}}\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <a class=\"sw-link-out\" href=\"http://{{row[cell.field]}}\" target=\"_blank\"></a>\r" +
    "\n" +
    "</div>"
  );

}]);

//# sourceMappingURL=sw-table.js.map