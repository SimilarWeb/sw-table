angular.module('sw.table', [])
    .constant('tableConfig', {
        pageSize: 100,
        sortDirection: 'ASC'
    })
    .controller('tableCtrl', function($scope) {
        // todo add default params to columns here so it doesn't need to be in every controller
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
            }
        };
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
