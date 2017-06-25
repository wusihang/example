/**
 * Created by wush1 on 2017/5/30.
 */
import angular from "angular";
import "babel-polyfill";
import "pagination/page";
//使用数组构造可以有效避免混淆js后引起错误
angular.module("aIndexApp", ['paging.directive']).controller("aIndexController", ["$scope", "$rootScope", "$http", ($scope, $rootScope, $http)=> {
    $scope.search = ()=>console.log("searching...");
    $scope.paging = data=> {
        $http({
            method: 'GET',
            url: '/rest/contentService/queryContent'
        }).then(response=> {
            if (response.data) {
                $scope.contents = response.data.contentList;
                $scope.totalCount = response.data.totalCount;
            }

        }, response=> {
            console.log("error:" + response.status);
        });
    };
    $scope.pageSize = $scope.pageSize || 5;
    $scope.currentPage = $scope.currentPage || 1;
    $scope.paging({pageSize: $scope.pageSize, currentPage: $scope.currentPage});
}]);