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
