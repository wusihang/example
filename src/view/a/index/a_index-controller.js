/**
 * Created by wush1 on 2017/5/30.
 */
import angular from "angular";
import "babel-polyfill";
import "pagination/page";
//使用数组构造可以有效避免混淆js后引起错误
angular.module("aIndexApp", ['paging.directive']).controller("aIndexController", ["$scope", "$rootScope", ($scope, $rootScope)=> {
    $scope.search = ()=>console.log("searching...");


    function* loadUI() {
        console.log("showUI");
        yield (()=>console.log("loadData"))();
        console.log("hideUI");
    }

    var loader  = loadUI();
    loader.next();
    loader.next();


    $scope.totalCount = 1001;
    resultChanged();
    $scope.counter = 0;
    $scope.paging = function (data) {
        $scope.pageSize = $scope.pageSize || 5;
        data = data || {pageSize: $scope.pageSize, currentPage: $scope.currentPage || 1};
        $scope.results = $scope.allResult.filter(function (item) {
            return item >= (data.currentPage - 1) * data.pageSize && item < data.currentPage * data.pageSize;
        });
    };
    $scope.paging();
    function resultChanged() {
        $scope.allResult = [];
        for (var i = 0; i < $scope.totalCount; i++) {
            $scope.allResult.push(i);
        }
    }

}]);