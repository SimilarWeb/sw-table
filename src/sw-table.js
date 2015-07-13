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
