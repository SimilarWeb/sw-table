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
